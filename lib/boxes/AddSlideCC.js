class AddSlideCC {
    constructor(initInfo){
        this.ccNum = initInfo.slideCC;
    }

    process(data){
        return new Promise((resolve, reject) => {
            console.log('adding Slide CC...');
            // console.log(data.env)
            // 
            // Instructions to process the input data
            // 
            resolve(data)
        })
    }
}


module.exports = AddSlideCC;