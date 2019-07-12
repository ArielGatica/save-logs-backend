const OltRecovery = require ('../models/oltRecovery');
const OltFault = require('../models/oltFault');
const OltCommands = require('../models/oltCommands');
const fs = require('fs');

exports.listOltRecovery = async (req, res) =>{
    await OltRecovery.find((err, logsOltRecovery) =>{
        if(!err)
            res.status(200).json({ data: logsOltRecovery });
        else
            res.status(500).send('Error al intentar leer Logs OLT Recovery: ', err);
    })
}

exports.listOltFault = async (req, res) =>{
    await OltFault.find((err, logsOltFault) =>{
        if(!err)
            res.status(200).json({ data: logsOltFault });
        else
            res.status(400).send('Error al intentar listar Logs OLT Fault: ', err);
    })
}

exports.listOltCommands = async (req, res) =>{
    await OltCommands.find((err, oltCommands) =>{
        if(!err)
            res.status(200).json({ data: oltCommands });
        else
            res.status(400).send('Error al intentar listar Logs OLT Comandos: ', err)
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

            let getSearchSlot = valueResponse.search(', PortID: ');
            let getDataSlot = valueResponse.substring(getSearchFrame2, getSearchSlot);

            let getSearchPort = valueResponse.search(', ONT ID: ');
            let getDataPort = valueResponse.substring(getSearchSlot, getSearchPort);

            let getSearchOnt = valueResponse.search(', Equipment ID: ');
            let getDataOnt = valueResponse.substring(getSearchPort , getSearchOnt);

            let getDataEquipment = valueResponse.substring(getSearchOnt, valueResponse.length-1);

            let newOltRecovery = new OltRecovery({
                date: getOtherData[5] + ' ' + getOtherData[6],
                ip: getOtherData[3],
                severity: 'RECOVERY CLEARED',
                alarm_name: getDataName.replace('ALARM NAME :', ''),
                frame_id: getDataFrame.replace(':FrameID: ', ''),
                slot_id: getDataSlot.replace(', SlotID: ', ''),
                port_id: getDataPort.replace(', PortID: ', ''),
                ont_id: getDataOnt.replace(', ONT ID: ', ''),
                equipment_id : getDataEquipment.replace(', Equipment ID: ', '')
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

exports.saveOltFault = (req, res) =>{
    const readLogs = new Promise((resolve, reject) =>{
        fs.readFile('/var/log/fileToSave2', ('utf-8'), (err, content) =>{
            if(!err){
                resolve(content
                    .split('\n')
                    .filter((faultFilter) => { return faultFilter.indexOf(('FAULT')) > -1 })
                    .filter((parametersFilter) => { return parametersFilter.indexOf(('PARAMETERS')) > -1})
                );
            }else
                reject(err);
        })
    })
    readLogs.then((response) =>{
        const respuesta = response.map((valueResponse) => {

            let getDate = valueResponse.split(' ');

            let getSearchZ = valueResponse.search('Z');
            let getSearchCat =  valueResponse.search('#');
            let getDataIp = valueResponse.substring(getSearchZ+1, getSearchCat-1);
        
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
            let getDataOnt = valueResponse.substring(getSearchPort , getSearchOnt);

            let getDataEquipment = valueResponse.substring(getSearchOnt, valueResponse.length-1);

            let newOltFault = new OltFault({
                date: getDate[5] + ' ' + getDate[6],
                ip: getDataIp.replace(' ', ''),
                severity: 'FAULT MINOR',
                alarm_name: getDataName.replace('ALARM NAME :', ''),
                frame_id: getDataFrame.replace(':FrameID: ', ''),
                slot_id: getDataSlot.replace(', SlotID: ', ''),
                port_id: getDataPort.replace(', PortID: ', ''),
                ont_id: getDataOnt.replace(', ONT ID: ', ''),
                equipment_id : getDataEquipment ? getDataEquipment.replace(', Equipment ID: ', '') : ''
            })
            newOltFault.save()
        })

        if(respuesta != undefined)
            res.status(200).send('Logs OLT Fault guardados correctamente');
        else
            res.status(500).send('Error al intentar guardar OLT Fault');
    })
    .catch((err) =>{
        throw err;
    });
}

exports.saveOltCommands = (req, res) =>{
    const readCommands = new Promise((resolve, reject) =>{
        fs.readFile('/var/log/fileCommands', ('utf-8'), (err, content) =>{
            if(!err){
                resolve(content
                    .split('\n')
                    .filter((telnetFilter) => { return telnetFilter.indexOf(('Telnet')) > -1})
                    .filter((cmdFilter) => { return cmdFilter.indexOf(('cmd')) > -1})
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

            let newOltCommands = new OltCommands({
                date: getData[5],
                ip_olt: getData[3],
                ip: getDataIp = getDataIp.replace('Telnet ',''),
                user: getData[9],
                command: getDataCmd.replace('cmd: ','')
            })
            newOltCommands.save()
        })
        if(respuesta != undefined)
        res.status(200).send('Logs OLT Commands guardados correctamente');
        else
            res.status(500).send('Error al intentar guardar OLT Commands');
    })
    .catch((err) =>{
        throw err;
    })
}
