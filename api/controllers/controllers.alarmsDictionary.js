const AlarmsDictionary = require('../models/alarmsDictionary');

exports.findAlarmsDictionary = async (req, res) =>{
    await AlarmsDictionary.find((err, dictionary) =>{
        if(!err)
            res.status(200).json({ data: dictionary });
        else
            res.status(400).send({ message: `Error al intentar listar Dicionario de OLT: ${err}` });
    })
}

exports.saveAlarmsDictionary = async (req, res) =>{
    let newAlarmsDictionary = new AlarmsDictionary({
        fault: req.body.fault,
        recovery: req.body.recovery
    })  
    await newAlarmsDictionary.save((err) => {
        if(!err)
            res.status(200).send({ message: 'Diccionario OLT guardado correctamente' });
        else
            res.status(500).send({ message: `Error al intentar guardar Diccionario OLT: ${err}`});
    })
    
}

exports.editAlarmsDictionary = async (req, res) =>{
    await AlarmsDictionary.findById({ _id: req.body._id }, (err, alarmDictionary) =>{
        if(err)
            res.status(400).send({ message: `Error, de busqueda para editar Diccinario de alarmas: ${err}` });
        if(alarmDictionary){
            let editAlarm = {
                fault: req.body.fault,
                recovery: req.body.recovery
            }
            
            AlarmsDictionary.findByIdAndUpdate({ _id: req.body._id },{ $set: editAlarm }, (err) =>{
                if(!err)
                    res.status(200).send({ message: 'Diccionario de alarmas editado correctamente' });
                else
                    res.status(400).send({ message: `Error al intentar editar Diccionario de alarmas: ${err}`});
            })
        }else
            res.status(404).send({ message: `Error no se ha encontrado Dicionario de alarmas para editar: ${err}` });
    })
}

exports.removeAlarmsDictionary = async (req, res) =>{
    await AlarmsDictionary.findById({ _id: req.params._id} , (err, alarmsDictionary) =>{
        if(alarmsDictionary){
            alarmsDictionary.remove((err) =>{
                if(!err)
                    res.status(200).send({ message: 'Diccionario de alarmas eliminado correctamente' });
                else
                    res.status(500).send({ message: `Error al intentat eliminar Diccionario de alarmas: ${err}` })
            })
        }else
            res.status(404).send({ message: `Error, no se encontró Diccionario de alarmas para eliminar: ${err}` });
    })
}
