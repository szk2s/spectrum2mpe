const fs = require('fs');
const util = require('util');

class Patcher {
    constructor(config){
       this.config = config;
       this.boxes = [];
    }

    autoGen(_boxes) {
        this.boxes = _boxes.map(_Box => {
            return new _Box(this.config);
        });
    }

    run(){
        let data = {};
        this.boxes.forEach( async (box) => {
            data = await box.process(data);
        })
    }
}

module.exports = Patcher;