const OltRecovery = require('../models/oltRecovery');
const OltFault = require('../models/oltFault');

exports.oltMatch = (req, res) =>{
    
    const findFault = new Promise((resolve, reject) =>{
        OltFault.find((err, logsFault) =>{
            if(!err)
                resolve(logsFault);
            else
                reject('Error: ' + err);
        })
    })
    
    const findRecovery = new Promise((resolve, reject) =>{
        OltRecovery.find((err, logsRecovery) =>{
            if(!err)
                resolve(logsRecovery);
            else
                reject('Error:' + err);
        })
    })

    Promise.all([findFault, findRecovery]).then((response) =>{
        
        const faultLogs = response[0];
        const recoveryLogs = response[1];

        faultLogs.map(mapFault =>{
            recoveryLogs.map(mapRecovery =>{

                if(
                    mapRecovery.date > mapFault.date && mapRecovery.ip == mapFault.ip && mapRecovery.frame_id == mapFault.frame_id &&
                    mapRecovery.slot_id == mapFault.slot_id && mapRecovery.port_id == mapFault.port_id && mapRecovery.ont_id == mapFault.ont_id &&
                    mapRecovery.equipment_id == mapFault.equipment_id
                ){
                    let newFaultId = {
                        olt_fault_id: mapFault._id
                    }

                    OltRecovery.updateOne({ _id: mapRecovery._id }, { $set: newFaultId }, (err) =>{
                        if(!err)
                            console.log("Match OK OLT Recovery =>" + mapRecovery._id);
                        else
                           console.log("Error Match OLT Recovery: " + err);
                    })

                    let newRecoveryId = {
                        olt_recovery_id: mapRecovery._id
                    }

                    OltFault.updateOne({ _id: mapFault._id }, { $set: newRecoveryId }, (err) =>{
                        if(!err)
                            console.log("Match OK OLT Fault =>" + mapFault._id);
                        else
                           console.log("Error Match OLT Fault: " + err);
                    })
                }
                else
                    console.log("NO MATCH")
            })
        })
        res.status(200).send({ message: 'Match (OLT Recovery - OLT Fault) relacionados correctamente' });
    })
}
