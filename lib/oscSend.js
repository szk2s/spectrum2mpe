//Deprecated (under Development)
function oscSend(data){
    return new Promise((resolve, reject) => {
        const ip = this.config.oscClient.ip;
        const port = this.config.oscClient.port;
        const client = new osc.Client(ip, port);

        console.log('Send OSC message to');
        console.log('IP : ' + ip + ', Port : ' + port)
        
        trigger();  //  Normal Mode
        // setInterval(trigger, 8300);  //  Loop Mode
        
        resolve(data)

        function trigger(){
            for(let i in data.timecode[0]){
                setTimeout(sendOSC, data.timecode[0][i]*1000, i);
            }
        }

        function sendOSC(i){
            let freqMsg = [];
            let ampMsg = [];
            for (let j in data.freqs){
                    freqMsg.push(data.freqs[j][i]);
                    ampMsg.push(data.amps[j][i]);
            }
            client.send('/frequency', freqMsg);
            console.log("/frequency " + freqMsg);
            client.send('/amplitude', ampMsg);
            console.log("/amplitude " + ampMsg);
        }
    })
}
