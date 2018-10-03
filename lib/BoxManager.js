const boxlist = require('./boxlist')
const boxdirectory = './boxes'

class BoxManager {
    constructor(){}

    create(arg){
        const boxname = arg['boxname'];
        const filepath = boxdirectory+'/'+boxlist[boxname].filename;
        const Box =  require(filepath);
        return new Box(arg)
    }
}

module.exports = BoxManager;