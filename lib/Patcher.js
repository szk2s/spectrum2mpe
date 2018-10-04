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

    autoGen(_boxes) {
        _boxes.forEach(_box => {
            const initInfo = {
                className : _box,
                config : this.config
            }
            this.addBox(initInfo);
        });
    }

    addBox(initInfo) {
        const box = this.boxManager.create(initInfo);
        this.boxes.push(box);
        return box; 
    }

    run(){
        let data = {};

        this.boxes.forEach( async (box) => {
            data = await box.process(data);
        })
        // // for debugging
        // const result = data;
        // console.log(Object.keys(result));
    }
}

module.exports = Patcher;