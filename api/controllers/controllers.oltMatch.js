const OltRecovery = require('../models/oltRecovery');
const OltFault = require('../models/oltFault');
const AlarmsDictionary = require('../models/alarmsDictionary');

exports.oltMatch = (req, res) =>{
    
    const findFault = new Promise((resolve, reject) =>{
        OltFault.find((err, logsFault) =>{
            if(!err)
                resolve(logsFault);
            else
                reject(`Error: ${err}`);
        })
    })
    
    const findRecovery = new Promise((resolve, reject) =>{
        OltRecovery.find((err, logsRecovery) =>{
            if(!err)
                resolve(logsRecovery);
            else
                reject(`Error: ${err}`);
        })
    })

    const findDictionary = new Promise((resolve, reject) =>{
        AlarmsDictionary.find((err, dictionary) =>{
            if(!err)
                resolve(dictionary);
            else
                reject(`Error: ${err}`);
        })
    })

    Promise.all([findFault, findRecovery, findDictionary]).then((response) =>{
        
        const faultLogs = response[0];
        const recoveryLogs = response[1];
        const alarmsDictionary = response[2];

        faultLogs.map(mapFault =>{
            recoveryLogs.map(mapRecovery =>{

                if(
                    mapRecovery.date > mapFault.date && mapRecovery.ip == mapFault.ip && mapRecovery.frame_id == mapFault.frame_id &&
                    mapRecovery.slot_id == mapFault.slot_id && mapRecovery.port_id == mapFault.port_id && mapRecovery.ont_id == mapFault.ont_id &&
                    mapRecovery.equipment_id == mapFault.equipment_id && mapFault.alarm_name == alarmsDictionary[0].fault
                    && mapRecovery.alarm_name == alarmsDictionary[0].recovery ||

                    mapRecovery.date > mapFault.date && mapRecovery.ip == mapFault.ip && mapRecovery.frame_id == mapFault.frame_id &&
                    mapRecovery.slot_id == mapFault.slot_id && mapRecovery.port_id == mapFault.port_id && mapRecovery.ont_id == mapFault.ont_id &&
                    mapRecovery.equipment_id == mapFault.equipment_id && mapFault.alarm_name == alarmsDictionary[1].fault
                    && mapRecovery.alarm_name == alarmsDictionary[1].recovery ||

                    mapRecovery.date > mapFault.date && mapRecovery.ip == mapFault.ip && mapRecovery.frame_id == mapFault.frame_id &&
                    mapRecovery.slot_id == mapFault.slot_id && mapRecovery.port_id == mapFault.port_id && mapRecovery.ont_id == mapFault.ont_id &&
                    mapRecovery.equipment_id == mapFault.equipment_id && mapFault.alarm_name == alarmsDictionary[2].fault
                    && mapRecovery.alarm_name == alarmsDictionary[2].recovery ||

                    mapRecovery.date > mapFault.date && mapRecovery.ip == mapFault.ip && mapRecovery.frame_id == mapFault.frame_id &&
                    mapRecovery.slot_id == mapFault.slot_id && mapRecovery.port_id == mapFault.port_id && mapRecovery.ont_id == mapFault.ont_id &&
                    mapRecovery.equipment_id == mapFault.equipment_id && mapFault.alarm_name == alarmsDictionary[3].fault
                    && mapRecovery.alarm_name == alarmsDictionary[3].recovery ||

                    mapRecovery.date > mapFault.date && mapRecovery.ip == mapFault.ip && mapRecovery.frame_id == mapFault.frame_id &&
                    mapRecovery.slot_id == mapFault.slot_id && mapRecovery.port_id == mapFault.port_id && mapRecovery.ont_id == mapFault.ont_id &&
                    mapRecovery.equipment_id == mapFault.equipment_id && mapFault.alarm_name == alarmsDictionary[4].fault
                    && mapRecovery.alarm_name == alarmsDictionary[4].recovery ||

                    mapRecovery.date > mapFault.date && mapRecovery.ip == mapFault.ip && mapRecovery.frame_id == mapFault.frame_id &&
                    mapRecovery.slot_id == mapFault.slot_id && mapRecovery.port_id == mapFault.port_id && mapRecovery.ont_id == mapFault.ont_id &&
                    mapRecovery.equipment_id == mapFault.equipment_id && mapFault.alarm_name == alarmsDictionary[5].fault
                    && mapRecovery.alarm_name == alarmsDictionary[5].recovery ||

                    mapRecovery.date > mapFault.date && mapRecovery.ip == mapFault.ip && mapRecovery.frame_id == mapFault.frame_id &&
                    mapRecovery.slot_id == mapFault.slot_id && mapRecovery.port_id == mapFault.port_id && mapRecovery.ont_id == mapFault.ont_id &&
                    mapRecovery.equipment_id == mapFault.equipment_id && mapFault.alarm_name == alarmsDictionary[6].fault
                    && mapRecovery.alarm_name == alarmsDictionary[6].recovery ||

                    mapRecovery.date > mapFault.date && mapRecovery.ip == mapFault.ip && mapRecovery.frame_id == mapFault.frame_id &&
                    mapRecovery.slot_id == mapFault.slot_id && mapRecovery.port_id == mapFault.port_id && mapRecovery.ont_id == mapFault.ont_id &&
                    mapRecovery.equipment_id == mapFault.equipment_id && mapFault.alarm_name == alarmsDictionary[7].fault
                    && mapRecovery.alarm_name == alarmsDictionary[7].recovery ||

                    mapRecovery.date > mapFault.date && mapRecovery.ip == mapFault.ip && mapRecovery.frame_id == mapFault.frame_id &&
                    mapRecovery.slot_id == mapFault.slot_id && mapRecovery.port_id == mapFault.port_id && mapRecovery.ont_id == mapFault.ont_id &&
                    mapRecovery.equipment_id == mapFault.equipment_id && mapFault.alarm_name == alarmsDictionary[8].fault
                    && mapRecovery.alarm_name == alarmsDictionary[8].recovery ||

                    mapRecovery.date > mapFault.date && mapRecovery.ip == mapFault.ip && mapRecovery.frame_id == mapFault.frame_id &&
                    mapRecovery.slot_id == mapFault.slot_id && mapRecovery.port_id == mapFault.port_id && mapRecovery.ont_id == mapFault.ont_id &&
                    mapRecovery.equipment_id == mapFault.equipment_id && mapFault.alarm_name == alarmsDictionary[9].fault
                    && mapRecovery.alarm_name == alarmsDictionary[9].recovery ||

                    mapRecovery.date > mapFault.date && mapRecovery.ip == mapFault.ip && mapRecovery.frame_id == mapFault.frame_id &&
                    mapRecovery.slot_id == mapFault.slot_id && mapRecovery.port_id == mapFault.port_id && mapRecovery.ont_id == mapFault.ont_id &&
                    mapRecovery.equipment_id == mapFault.equipment_id && mapFault.alarm_name == alarmsDictionary[10].fault
                    && mapRecovery.alarm_name == alarmsDictionary[10].recovery ||

                    mapRecovery.date > mapFault.date && mapRecovery.ip == mapFault.ip && mapRecovery.frame_id == mapFault.frame_id &&
                    mapRecovery.slot_id == mapFault.slot_id && mapRecovery.port_id == mapFault.port_id && mapRecovery.ont_id == mapFault.ont_id &&
                    mapRecovery.equipment_id == mapFault.equipment_id && mapFault.alarm_name == alarmsDictionary[11].fault
                    && mapRecovery.alarm_name == alarmsDictionary[11].recovery ||

                    mapRecovery.date > mapFault.date && mapRecovery.ip == mapFault.ip && mapRecovery.frame_id == mapFault.frame_id &&
                    mapRecovery.slot_id == mapFault.slot_id && mapRecovery.port_id == mapFault.port_id && mapRecovery.ont_id == mapFault.ont_id &&
                    mapRecovery.equipment_id == mapFault.equipment_id && mapFault.alarm_name == alarmsDictionary[12].fault
                    && mapRecovery.alarm_name == alarmsDictionary[12].recovery ||

                    mapRecovery.date > mapFault.date && mapRecovery.ip == mapFault.ip && mapRecovery.frame_id == mapFault.frame_id &&
                    mapRecovery.slot_id == mapFault.slot_id && mapRecovery.port_id == mapFault.port_id && mapRecovery.ont_id == mapFault.ont_id &&
                    mapRecovery.equipment_id == mapFault.equipment_id && mapFault.alarm_name == alarmsDictionary[13].fault
                    && mapRecovery.alarm_name == alarmsDictionary[13].recovery ||

                    mapRecovery.date > mapFault.date && mapRecovery.ip == mapFault.ip && mapRecovery.frame_id == mapFault.frame_id &&
                    mapRecovery.slot_id == mapFault.slot_id && mapRecovery.port_id == mapFault.port_id && mapRecovery.ont_id == mapFault.ont_id &&
                    mapRecovery.equipment_id == mapFault.equipment_id && mapFault.alarm_name == alarmsDictionary[14].fault
                    && mapRecovery.alarm_name == alarmsDictionary[14].recovery ||

                    mapRecovery.date > mapFault.date && mapRecovery.ip == mapFault.ip && mapRecovery.frame_id == mapFault.frame_id &&
                    mapRecovery.slot_id == mapFault.slot_id && mapRecovery.port_id == mapFault.port_id && mapRecovery.ont_id == mapFault.ont_id &&
                    mapRecovery.equipment_id == mapFault.equipment_id && mapFault.alarm_name == alarmsDictionary[15].fault
                    && mapRecovery.alarm_name == alarmsDictionary[15].recovery ||

                    mapRecovery.date > mapFault.date && mapRecovery.ip == mapFault.ip && mapRecovery.frame_id == mapFault.frame_id &&
                    mapRecovery.slot_id == mapFault.slot_id && mapRecovery.port_id == mapFault.port_id && mapRecovery.ont_id == mapFault.ont_id &&
                    mapRecovery.equipment_id == mapFault.equipment_id && mapFault.alarm_name == alarmsDictionary[16].fault
                    && mapRecovery.alarm_name == alarmsDictionary[16].recovery ||

                    mapRecovery.date > mapFault.date && mapRecovery.ip == mapFault.ip && mapRecovery.frame_id == mapFault.frame_id &&
                    mapRecovery.slot_id == mapFault.slot_id && mapRecovery.port_id == mapFault.port_id && mapRecovery.ont_id == mapFault.ont_id &&
                    mapRecovery.equipment_id == mapFault.equipment_id && mapFault.alarm_name == alarmsDictionary[17].fault
                    && mapRecovery.alarm_name == alarmsDictionary[17].recovery ||

                    mapRecovery.date > mapFault.date && mapRecovery.ip == mapFault.ip && mapRecovery.frame_id == mapFault.frame_id &&
                    mapRecovery.slot_id == mapFault.slot_id && mapRecovery.port_id == mapFault.port_id && mapRecovery.ont_id == mapFault.ont_id &&
                    mapRecovery.equipment_id == mapFault.equipment_id && mapFault.alarm_name == alarmsDictionary[18].fault
                    && mapRecovery.alarm_name == alarmsDictionary[18].recovery
                ){
                    let newFaultId = {
                        olt_fault_id: mapFault._id
                    }

                    OltRecovery.updateOne({ _id: mapRecovery._id }, { $set: newFaultId }, (err) =>{
                        if(!err)
                            console.log(`Match OK OLT Recovery => ${mapRecovery._id}`);
                        else
                           console.log(`Error Match OLT Recovery: ${err}`);
                    })

                    let newRecoveryId = {
                        olt_recovery_id: mapRecovery._id
                    }

                    OltFault.updateOne({ _id: mapFault._id }, { $set: newRecoveryId }, (err) =>{
                        if(!err)
                            console.log(`Match OK OLT Fault => ${mapFault._id}`);
                        else
                           console.log(`Error Match OLT Fault: ${err}`);
                    })
                }
                else
                    console.log(`NO MATCH`);
            })
        })
        res.status(200).send({ message: `Match (OLT Recovery - OLT Fault) relacionados correctamente` });
    })
}
