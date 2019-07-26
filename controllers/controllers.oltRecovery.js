const OltRecovery = require ('../models/oltRecovery');
const fs = require('fs');

exports.listOltRecovery = async (req, res) =>{
    await OltRecovery.find((err, logsOltRecovery) =>{
        if(!err)
            res.status(200).json({ data: logsOltRecovery });
        else
            res.status(500).send('Error al intentar leer Logs OLT Recovery: ', err);
    })
}

exports.saveOltRecovery = (req, res) =>{
    const readLogs = new Promise((resolve, reject) =>{
        fs.readFile('/var/log/fileToSave', ('utf-8'), (err, content) =>{
            if(!err){
                resolve(content
                    .split('\n')
                    .filter((recoveryFilter) => {  return recoveryFilter.indexOf(('RECOVERY')) > -1 })
                    .filter((parametersFilter) => {  return parametersFilter.indexOf(('PARAMETERS')) > -1 })
                );
            }else
                reject(err);
        })
    })
    readLogs.then((response) =>{
        const respuesta = response.map((valueResponse) => {
            let getOtherData = valueResponse.split(' ');
           
            let getSearch = valueResponse.search('ALARM NAME :');
            let getSearch2 = valueResponse.search('  PARAMETERS');
            let getDataName = valueResponse.substring(getSearch, getSearch2);

            let getSearchFrame = valueResponse.search(':FrameID: ');
            let getSearchFrame2 = valueResponse.search(', SlotID: ');
            let getDataFrame = valueResponse.substring(getSearchFrame, getSearchFrame2);
            let frameOnlyNumbers = getDataFrame.replace('#', '');

            let getSearchSlot = valueResponse.search(', PortID: ');
            let getDataSlot = valueResponse.substring(getSearchFrame2, getSearchSlot);
            let slotOnlyNumbers = getDataSlot.replace('#', '');

            let getSearchPort = valueResponse.search(', ONT ID: ');
            let getDataPort = valueResponse.substring(getSearchSlot, getSearchPort);
            let portOnlyNumbers = getDataPort.replace('#','');

            let getSearchOnt = valueResponse.search(', Equipment ID: ');
            let getDataOnt = valueResponse.substring(getSearchPort , getSearchOnt !== -1 ? getSearchOnt : valueResponse.length-getSearchOnt);
            let ontOnlyNumbers = getDataOnt.replace('#', '');
          
            let getDataEquipment = valueResponse.substring(getSearchOnt !== -1 ? getSearchOnt : valueResponse.length, valueResponse.length+1);

            OltRecovery.findOne({ date: getOtherData[5] + ' ' + getOtherData[6], ip: getOtherData[3] }, (err, logsOltRecovery) =>{
                if(err)
                    console.log("Error: " + err);
                else if(logsOltRecovery)
                    console.log("Estos datos ya existen, por ende no se guardarán en la BBDD: " + logsOltRecovery)
                else{
                    let newOltRecovery = new OltRecovery({
                        date: getOtherData[5] + ' ' + getOtherData[6],
                        ip: getOtherData[3],
                        severity: 'RECOVERY CLEARED',
                        alarm_name: getDataName.replace('ALARM NAME :', ''),
                        frame_id: frameOnlyNumbers.replace(':FrameID: ', ''),
                        slot_id: slotOnlyNumbers.replace(', SlotID: ', ''),
                        port_id: portOnlyNumbers.replace(', PortID: ', ''),
                        ont_id: ontOnlyNumbers.replace(', ONT ID: ', ''),
                        equipment_id: getDataEquipment !== '' && getDataEquipment.length !== 1 ? getDataEquipment.replace(', Equipment ID: ', '') : ''
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




