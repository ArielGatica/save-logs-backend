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
        fs.readFile('/var/log/fileToSave2', ('utf-8'), (err, content) =>{
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

            let getSearchSlot = valueResponse.search(', PortID: ');
            let getDataSlot = valueResponse.substring(getSearchFrame2, getSearchSlot);

            let getSearchPort = valueResponse.search(', ONT ID: ');
            let getDataPort = valueResponse.substring(getSearchSlot, getSearchPort);

            let getSearchOnt = valueResponse.search(', Equipment ID: ');
            let getDataOnt = valueResponse.substring(getSearchPort , getSearchOnt !== -1 ? getSearchOnt : valueResponse.length-getSearchOnt);
            
            let getDataEquipment = valueResponse.substring(getSearchOnt !== -1 ? getSearchOnt : valueResponse.length, valueResponse.length+1);

            let newOltRecovery = new OltRecovery({
                date: getOtherData[5] + ' ' + getOtherData[6],
                ip: getOtherData[3],
                severity: 'RECOVERY CLEARED',
                alarm_name: getDataName.replace('ALARM NAME :', ''),
                frame_id: getDataFrame.replace(':FrameID: ', ''),
                slot_id: getDataSlot.replace(', SlotID: ', ''),
                port_id: getDataPort.replace(', PortID: ', ''),
                ont_id: getDataOnt.replace(', ONT ID: ', ''),
                equipment_id : getDataEquipment !== '' && getDataEquipment.length !== 1 ? getDataEquipment.replace(', Equipment ID: ', '') : ''
            })
            newOltRecovery.save()
        })

        if(respuesta != undefined)
            res.status(200).send('Logs OLT Recovery guardados correctamente');
        else
            res.status(500).send('Error al intentar guardar OLT Recovery');
    }).catch((err) =>{
        throw err;
    })
}




