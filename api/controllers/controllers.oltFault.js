const OltFault = require('../models/oltFault');
const fs = require('fs');

exports.listOltFault = async (req, res) =>{
    await OltFault.find((err, logsOltFault) =>{
        if(!err){
            let getClass = logsOltFault.map(mapLogs => mapLogs.classification)


            res.status(200).json({ data: getClass });
        }
        else
            res.status(400).send(`Error al intentar listar Logs OLT Fault: ${err}`);
    })
}

exports.saveOltFault = (req, res) =>{
    const readLogs = new Promise((resolve, reject) =>{
        fs.readFile('/app/log/messages', ('utf-8'), (err, content) =>{
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
            let frameOnlyNumbers = getDataFrame.replace('#', '');

            let getSearchSlot = valueResponse.search(', PortID: ');
            let getDataSlot = valueResponse.substring(getSearchFrame2, getSearchSlot);
            let slotOnlyNumbers = getDataSlot.replace('#', '');

            let getSearchPort = valueResponse.search(', ONT ID: '); //getSearchSlot, getSearchPort !== -1 ? getSearchPort : valueResponse.length+getSearchSlot
            let getDataPort = valueResponse.substring(getSearchSlot, getSearchPort !== -1 ? getSearchPort : valueResponse.length+getSearchSlot);
            let portOnlyNumbers = getDataPort.replace('#', '');

            let getSearchOnt = valueResponse.search(', Equipment ID: ');
            let getDataOnt = valueResponse.substring(getSearchPort , getSearchOnt !== -1 ? getSearchOnt : valueResponse.length-getSearchOnt);
            let ontOnlyNumbers = getDataOnt.replace('#', '');

            let getDataEquipment = valueResponse.substring(getSearchOnt !== -1 ? getSearchOnt : valueResponse.length+getSearchOnt, valueResponse.length+1);

            let obtenerName = getDataName.replace('ALARM NAME :', '')


            let dot = valueResponse.indexOf(', PortID: ');
            let test = valueResponse.indexOf(', ONT ID: ');

            let getDataTest = valueResponse.substring(dot, test !== -1 ? test : valueResponse.length+dot)

            /*console.log(test)
            console.log(getDataTest)            
            return false*/

            //OLT CLASSIFICATION
            let oltClass = '';
            if(obtenerName.indexOf('An exception occurs in the EMU') == 0)
                oltClass = 'OLT_ENERGIA';
            else if(obtenerName.indexOf('The communication between') == 0)
                oltClass = 'OLT_ENERGIA';
            else if(obtenerName.indexOf('Communication with the device') == 0)
                oltClass = 'OLT_FUERA';
            else if(obtenerName.indexOf('The LOS occurs on the Ethernet') == 0)
                oltClass = 'UPLINK';
            else if(obtenerName.indexOf('The upstream ethernet port connection') == 0)
                oltClass = 'UPLINK';
            else if(obtenerName.indexOf('The LOS occurs on the Ethernet optical port#015#012') == 0)
                oltClass = 'UPLINK';
            else if(obtenerName.indexOf('The feeder fiber is broken or OLT can not receive any expected') == 0)
                oltClass = 'PON_CORTE_FO';
            else if(obtenerName.indexOf('The backbone fiber') == 0)
                oltClass = 'PON_CORTE_PROTECCION';
            else if(obtenerName.indexOf('The dying-gasp of GPON ONTi') == 0)
                oltClass = 'ONT_ENERGIA';
            else if(obtenerName.indexOf('The loss of GEM channel') == 0)
                oltClass = 'ONT_PROBLEMA_FO';
            else if(obtenerName.indexOf('The loss of frame of ONTi') == 0)
                oltClass = 'ONT_PROBLEMA_FO';
            else if(obtenerName.indexOf('The distribute fiber is broken or the OLT') ==  0)
                oltClass = 'ONT_CORTE_FO';
            else if(obtenerName.indexOf('The feeder fiber is broken or OLT can not receive any expected') == 0)
                oltClass = 'ONT_CORTE_FO';
            else if(obtenerName.indexOf('optical signals(LOS)') == 0)
                oltClass = 'ONT_CORTE_FO';
            else if(obtenerName.indexOf('The system resources usage') == 0)
                oltClass = 'ONT_PROBLEMA_CPU';
            else if(obtenerName.indexOf('Remote optical transceiver parameters') == 0)
                oltClass = 'ONT_PROBLEMA_FO';
            else if(obtenerName.indexOf('Loss of signal occurs') == 0)
                oltClass = 'ONT_E1';
            else if(obtenerName.indexOf('Alarm indication signal') == 0)
                oltClass = 'ONT_E1';
            else if(obtenerName.indexOf('The input signal of the one') == 0)
                oltClass = 'ONT_E1';
            else if(obtenerName.indexOf('The optical transceiver is absence') == 0)
                oltClass = 'ONT_SIN_MODULO_SFP';
            else if(obtenerName.indexOf('One or more ONTs unde') == 0)
                oltClass = 'ONT_PROBLEMA_FO';
            else if(obtenerName.indexOf('The GPON ONT configuration recovery fails#015#012') == 0)
                oltClass = 'ONT';
            else if(obtenerName.indexOf('The loss of frame of ONTi (LOFi) occurs#015#012') == 0)
                oltClass = 'ONT_FIBRA';
            else if(obtenerName.indexOf('The distribute fiber is broken or the OLT cannot receive expected optical signals from the ONT(LOSi/LOBi)#015#012') == 0)
                oltClass = 'ONT_FIBRA'
            else if(obtenerName.indexOf('The loss of GEM channel delineation') == 0)
                oltClass = 'ONT_FIBRA'
            else if(obtenerName.indexOf('One or more ONTs under this port failed in ranging#015#012') == 0)
                oltClass = 'ONT_FIBRA'
            else
                oltClass = 'OTRO';

            //OLT SEVERITY
            let oltSeverity = '';
            if(valueResponse.indexOf('FAULT MAJOR') !== -1)
                oltSeverity = 'FAULT MAJOR';
            else if(valueResponse.indexOf('FAULT WARNING') !== -1)
                oltSeverity = 'FAULT WARNING';
            else if(valueResponse.indexOf('FAULT MINOR') !== -1)
                oltSeverity = 'FAULT MINOR';


            OltFault.findOne({ date: getDate[5] + ' ' + getDate[6], severity: oltSeverity }, (err, logsOltFault) =>{
                if(err)
                    console.log(`Error: ${err}`);
                else if(logsOltFault)
                    console.log(`Estos datos ya existen, por ende no se guardarán en la BBDD: ${logsOltFault}`);
                else{
                    let newOltFault = new OltFault({
                        date: getDate[5] + ' ' + getDate[6],
                        ip: getDate[3],
                        severity: oltSeverity,
                        alarm_name: getDataName.replace('ALARM NAME :', ''),
                        classification: oltClass,
                        frame_id: frameOnlyNumbers.replace(':FrameID: ', ''),
                        slot_id: slotOnlyNumbers.replace(', SlotID: ', ''),
                        port_id: portOnlyNumbers.replace(', PortID: ', ''),
                        ont_id: getDataOnt == -1 ? 522 : ontOnlyNumbers.replace(', ONT ID: ', ''),
                        equipment_id : getDataEquipment !== '' && getDataEquipment.length !== 1  ? getDataEquipment.replace(', Equipment ID: ', '') : ''
                    })
                    newOltFault.save();
                }
            });
        })

        if(respuesta !== undefined)
            res.status(200).send('Logs OLT Fault guardados correctamente');
        else
            res.status(500).send('Error al intentar guardar OLT Fault');
    })
    .catch((err) =>{
        throw err;
    });
}