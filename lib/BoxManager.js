const boxlist = require('./boxlist')
// Node.jsのデフォルトの仕様でフォルダ名をrequireした時はそのディレクトリのindex.jsを読みに行く
const Boxes = require('./boxes');

class BoxManager {
    create(arg){
        const boxname = arg.boxname;
        const { classname } = boxlist[boxname];
        const Box =  Boxes[classname];
        return new Box(arg)
    }
}

module.exports = BoxManager;