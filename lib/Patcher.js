const BoxManager = require('./BoxManager')

class Patcher {
    constructor(config){
       this.config = config;
       this.boxes = [];
       this.boxManager = new BoxManager;
    }

    build(callback){
        callback();
    }

    addBox() {
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
        const result = data;
        // console.log(Object.keys(result));  //for debugging
    }
}

module.exports = Patcher;