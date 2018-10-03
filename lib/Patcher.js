const BoxManager = require('./BoxManager')

class Patcher {
    constructor(config){
       this.config = config;
       this.boxes = [];
       this.boxManager = new BoxManager();
    }

    build(callback){
        callback();
    }

    initWith(_boxes) {
        this.boxes = _boxes.map(_box => {
            return this.addBox(_box);
        });
    }

    // 本当はboxManager.createの引数(オブジェクト)をaddBoxの引数(オブジェクト)で受け取った方がよい
    addBox() {

        // 特にargumentsを使ってしまうと、書いた本人以外にこの関数がどんな引数を要求しているのかわかりにくくなってしまう。
        // たとえばもしこの関数が、
        // addBox({ boxname, boxargs }) ← この波括弧はES6のobject destrucuring (参考: https://qiita.com/Saayaman/items/74fefd7ea4b04a371bc8)、
        // という風に定義されていれば
        // この関数の引数は、boxnameとboxargsをプロパティに持つオブジェクトだということが誰にとっても一目瞭然になるだけではなく、
        // もし使用時に間違った引数を渡した時に、そもそもboxnameやboxargsというプロパティがない時点でboxManager.createを呼ぶ前にエラーを発見できるので、
        // このパターンは特に積極的に検討すると良いと思う。

        const box = this.boxManager.create({
            boxname : arguments[0], 
            boxargs : [...arguments],
            config : this.config
        });
        this.boxes.push(box);
        return box; 
    }

    run(){
        let data = {};
        this.boxes.forEach((box) => {
            data = box.process(data);
        })

        // ※ forEachはprocessメソッドの中に非同期処理が入っていた時に待たずに進んでしまうので、本当はasync/awaitを使って同期処理ができるようにそれぞれのBox系クラスのprocessメソッドがPromiseを返すように設計しておいた方が良い。
        // box.processがPromiseを返す仕様になっていれば下のように書くと必ず同期して処理される。

        // this.boxes.forEach( async (box) => {
        //     data = await box.process(data);
        // })

        const result = data;
        // console.log(Object.keys(result));  //for debugging
    }
}

module.exports = Patcher;