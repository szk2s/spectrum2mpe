class ClassName {
    constructor(initInfo){
        
    }

    process(data){
        return new Promise((resolve, reject) => {
            console.log('Processing...');
            // 
            // Instructions to process the input data
            // 
            resolve(data)
        })
    }
}


module.exports = ClassName;