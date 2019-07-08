const Logs = require('../models/logs');
const fs = require('fs');

exports.listLogs = async (req, res) =>{
    await Logs.find((err, logs) =>{
        if(!err)
            res.status(200).json(logs);
        else
            res.status(500).send('Error al intentar leer logs: ' + err);
    })
}

exports.watchLogs = (req, res) =>{
    
    const readLogs = new Promise((resolve, reject) =>{
        fs.readFile('/api/app/messages', ('utf-8'), (err, content) =>{
            if(!err)
                resolve(content.split('\n'))
            else
                reject(err);
        })
    })
    readLogs.then((response) =>{

        let respuesta = response.filter((respFilter) =>{
            return respFilter.indexOf(('NAME')) > -1
        }).map((responseLogs) =>{
            let newLogs = new Logs({
                logs: responseLogs
            })
            newLogs.save()
        })

        if(respuesta != undefined)
            res.status(200).send('Logs guardados correctamente');
        else
            res.status(500).send('Error al intentar guardar Logs');
    }).catch((err) =>{
        res.status(400).send(err);
    })
}


