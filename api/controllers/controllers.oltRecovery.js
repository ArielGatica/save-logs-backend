const config = require('../config');
const OltRecovery = require ('../models/oltRecovery');
const fs = require('fs');
const moment = require('moment-timezone');


exports.listOltRecovery = async (req, res) =>{
    await OltRecovery.find((err, logsOltRecovery) =>{
        if(!err)
            res.status(200).json({ oltRecovery: logsOltRecovery });
        else
            res.status(500).send(`Error al intentar leer Logs OLT Recovery: ${err}`);
    })
}

exports.saveOltRecovery = (req, res) =>{
    const dateFilter = new moment().tz('America/Santiago').format('YYYY-MM-DD-HH');
    const readLogs = new Promise((resolve, reject) =>{
        fs.readFile(`${ config.prod.FILE_LOGS + dateFilter }.log`, ('utf-8'), (err, content) =>{
            if(!err){
                resolve(content
                    .split('\n')
                    .filter((recoveryFilter) => { return recoveryFilter.indexOf(('RECOVERY')) > -1 })
                    .filter((parametersFilter) => { return parametersFilter.indexOf(('PARAMETERS')) > -1 })
                );
            }else
                reject(err);
        })
    })
    readLogs.then((response) =>{

        const respuesta = response.map((valueResponse) => {
            let getOtherData = valueResponse.split(' ');
            let getDates = getOtherData[0].split('.');
            let getSearch = valueResponse.search('ALARM NAME :');
            let getSearch2 = valueResponse.search('  PARAMETERS');
            let getDataName = valueResponse.substring(getSearch, getSearch2);

            let splitData = valueResponse.split('PARAMETERS :')
            let getParameters = splitData[1].split(',');

            OltRecovery.findOne({ date: getDates[0], ip: getOtherData[5] }, (err, logsOltRecovery) =>{
                if(err)
                    console.log(`Error: ${err}`);
                else if(logsOltRecovery)
                    console.log(`Estos datos ya existen, por ende no se guardarán en la BBDD: ${logsOltRecovery}`)
                else{
                    let newOltRecovery = new OltRecovery({
                        date: getDates[0],
                        ip: getOtherData[5],
                        severity: 'RECOVERY CLEARED',
                        alarm_name: getDataName.replace('ALARM NAME :', ''),
                        frame_id: getParameters[0] !== undefined ? getParameters[0].replace('FrameID: ', '') : '',
                        slot_id: getParameters[1] !== undefined ? getParameters[1].replace(' SlotID: ', '') : '',
                        port_id: getParameters[2] !== undefined ? getParameters[2].replace(' PortID: ', '') : '',
                        ont_id: getParameters[3] !== undefined ? getParameters[3].replace(' ONT ID: ', '') : '',
                        equipment_id: getParameters[4] !== undefined ? getParameters[4].replace(' Equipment ID: ', '') : ''
                    })
                    newOltRecovery.save();
                }
            })
        })

        if(respuesta !== undefined)
            res.status(200).send('Logs OLT Recovery guardados correctamente');
        else
            res.status(500).send('Error al intentar guardar OLT Recovery');
    }).catch((err) =>{
        throw err;
    })
}
