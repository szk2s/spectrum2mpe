// Node.jsのデフォルトの仕様でフォルダ名をrequireした時はそのディレクトリのindex.jsを読みに行く
const Boxes = require('./boxes');
class BoxManager {
    create(arg){
        const { boxname } = arg;
        const Box =  Boxes[boxname];
        return new Box(arg)
    }
}

module.exports = BoxManager;