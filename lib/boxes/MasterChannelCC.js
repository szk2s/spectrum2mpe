class MasterChannelCC {
    constructor(initInfo){
        this.ccNum = initInfo.slideCC;
    }

    process(data){
        return new Promise((resolve, reject) => {
            console.log('Now processing 1ch as a master channel...');
            // Instructions to process the input data
            // 
            resolve(data)
        })
    }
}


module.exports = MasterChannelCC;