const Boxes = require('./boxes');
class BoxManager {
    create(initInfo){
        const Box =  Boxes[initInfo.className];
        return new Box(initInfo)
    }
}

module.exports = BoxManager;