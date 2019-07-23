const OltCommands = require('../models/oltCommands');
const fs = require('fs');

exports.listOltCommands = async (req, res) =>{
    await OltCommands.find((err, oltCommands) =>{
        if(!err)
            res.status(200).json({ data: oltCommands });
        else
            res.status(400).send('Error al intentar listar Logs OLT Comandos: ', err)
    })
}

exports.saveOltCommands = (req, res) =>{
    const readCommands = new Promise((resolve, reject) =>{
        fs.readFile('/var/log/fileCommands', ('utf-8'), (err, content) =>{
            if(!err){
                resolve(content
                    .split('\n')
                    .filter((telnetFilter) => { return telnetFilter.indexOf(('Telnet')) > -1 })
                    .filter((cmdFilter) => { return cmdFilter.indexOf(('cmd')) > -1 })
                );
            }else
                reject(err);
        })
    })
    readCommands.then((response) =>{
        const respuesta = response.map((valueResponse) =>{
            let getData = valueResponse.split(' ');

            let searchCmd = valueResponse.search('cmd: ');
            let getDataCmd = valueResponse.substring(searchCmd, valueResponse.length+1);

            let searchTelnet = valueResponse.search('Telnet');
            let getDataIp = valueResponse.substring(searchCmd-1, searchTelnet)

            OltCommands.findOne({ date: getData[5] + ' ' + getData[6] }, (err, logsCommands) => { 
                if(logsCommands) 
                    console.log("Estos datos ya existen, por ende no se guardarán en la BBDD: " + logsCommands);
                else if(err)
                    console.log("Error: " + err);
                else{   
                    let newOltCommands = new OltCommands({
                        date: getData[5] + ' ' + getData[6],
                        ip_olt: getData[3],
                        ip: getDataIp = getDataIp.replace('Telnet ',''),
                        user: getData[9],
                        command: getDataCmd.replace('cmd: ','')
                    })
                    newOltCommands.save();
                }  
            });
        })
        
        if(respuesta !== undefined)
            res.status(200).send('Logs OLT Commands guardados correctamente');
        else
            res.status(500).send('Error al intentar guardar OLT Commands');
    })
    .catch((err) =>{
        throw err;
    })
}