var mysql = require('mysql');
//var bcrypt = require('bcrypt-nodejs');
var dbconfig = require('../config/database');
var conex = mysql.createConnection(dbconfig.connection);

conex.query('USE ' + dbconfig.database);


async function getTareas(req, res){
    console.log ('paso');
    sql = "SELECT TAR.id, TAR.nombre, TAR.descripcion, CONCAT(PER.nombre, ' ', PER.apellido) AS responsable, PER.url_img_perfil, REL.tx_tarea_relevancia, DATE_FORMAT(vencimiento, '%d/%m/%Y') as vencimiento, EST.tx_tarea_estado, EST.css FROM tarea as TAR LEFT JOIN personal as PER ON PER.id = TAR.personal_id LEFT JOIN tarea_relevancia as REL ON REL.id = TAR.relevancia_tarea_id LEFT JOIN tarea_estado as EST ON EST.id = TAR.estado_tarea_id";
    console.log ('paso');        
    conex.query(sql, function(error, resultado, fields){
        if (error) {
            console.log("Ha ocurrido un error en la consulta", error.message);
            return res.status(404).send("Ha ocurrido un error en la consulta");
        }

        res.render('tarea/all-tarea', {resultado, layout: 'mainlayout'});
        

    });
}


async function tareaRender(req, res){
    sql = "select id, CONCAT(nombre, ' ', apellido) AS responsable from personal";
    conex.query(sql, function(error, result_personal, fields){
        if (error) {
            console.log("Ha ocurrido un error en la consulta", error.message);
            return res.status(404).send("Ha ocurrido un error en la consulta");
        }
        sql = "select id, tx_tarea_relevancia from tarea_relevancia";
        conex.query(sql, function(error, result_relevancia, fields){
            if (error) {
                console.log("Ha ocurrido un error en la consulta", error.message);
                return res.status(404).send("Ha ocurrido un error en la consulta");
            }
            res.render('tarea/new-tarea', {result_personal, result_relevancia, layout:'mainlayout'});
        });

    });
}



async function newTarea(req, res){
    const {nombre, descripcion, relevancia, responsable, vencimiento} = req.body;
    const errors = [];
    if (!nombre) {
        errors.push({text: 'Ingrese nombre de tarea.'});
    }
    if (!descripcion) {
        errors.push({text: 'Ingrese descripcion de la tarea.'});
    }
    if (!relevancia) {
       errors.push({text: 'Seleccione Relevancia de la tarea.'});
    }
    if (!responsable) {
        errors.push({text: 'Seleccione Responsable de la tarea.'});
    }    
    if (!vencimiento) {
        errors.push({text: 'Seleccione Vencimiento de la tarea.'});
    }    
     
    if (errors.length > 0) {
        res.render('tarea/new-tarea', {
        errors,
        nombre,
        descripcion,
        relevancia,
        responsable,
        vencimiento,
        layout: 'mainlayout'
        });
    } else {
        sql = "INSERT INTO tarea (`nombre`, `descripcion`, `personal_id`, `relevancia_tarea_id`, `vencimiento`, `estado_tarea_id`) VALUES ('" + nombre + "', '" + descripcion + "', " + responsable + ", "+relevancia+", '"+vencimiento+"', 1)";
        conex.query(sql, function(error, resultado, fields){
            if (error) {
                console.log("Ha ocurrido un error en la consulta", error.message);
                return res.status(404).send("Ha ocurrido un error en la consulta");
            }
            req.flash('success_msg', 'Nueva Tarea Creada');
            res.redirect('/tarea');
        });
    }
}


function tareaEditRender(req, res){
    if (!isNaN(req.params.id)) { ////// solo la primera vez entra y luego vuelve a intentar  ??????
        sql = "SELECT TAR.id, TAR.nombre, TAR.descripcion, CONCAT(PER.nombre, ' ', PER.apellido) AS responsable, PER.url_img_perfil, REL.tx_tarea_relevancia, DATE_FORMAT(vencimiento, '%Y-%m-%d') as vencimiento, EST.tx_tarea_estado, personal_id, relevancia_tarea_id, estado_tarea_id, EST.css FROM tarea as TAR LEFT JOIN personal as PER ON PER.id = TAR.personal_id LEFT JOIN tarea_relevancia as REL ON REL.id = TAR.relevancia_tarea_id LEFT JOIN tarea_estado as EST ON EST.id = TAR.estado_tarea_id WHERE TAR.id = '"+req.params.id+"'";
        conex.query(sql, function(error, result_tarea, fields){
            sql = "select id, CONCAT(nombre, ' ', apellido) AS responsable from personal";
            conex.query(sql, function(error, result_personal, fields){
                sql = "select id, tx_tarea_relevancia from tarea_relevancia";
                conex.query(sql, function(error, result_relevancia, fields){
                    sql = "select id, tx_tarea_estado from tarea_estado";
                    conex.query(sql, function(error, result_estado, fields){
                        result_tarea = result_tarea[0];
                        res.render('tarea/edit-tarea', {result_tarea, result_personal, result_relevancia, result_estado, layout:'mainlayout'});                 
                    });    
                    
                });
            });
        }); 

    } else {
        console.log('paso si que lo llamen -> GUORNINGGGG!!!!');
    }
}
    
function tareaEdit(req, res){
    const {nombre, descripcion, relevancia, responsable, vencimiento, estado} = req.body;
    //const {nombre, descripcion, relevancia, responsable, vencimiento} = req.body;
    let id = req.params.id;
    console.log ('id :'+id+'\n');
    console.log ('nombre :'+nombre+'\n');
    console.log ('descripcion :'+descripcion+'\n');
    console.log ('+relevancia :'+relevancia+'\n');
    console.log ('responsable :'+responsable+'\n');
    console.log ('vencimiento :'+vencimiento+'\n');
    console.log ('Estado :'+estado+'\n');
    
    sql = "UPDATE tarea SET nombre = '"+nombre+"', descripcion = '"+descripcion+"', personal_id = "+responsable+", relevancia_tarea_id = "+relevancia+", vencimiento = '"+vencimiento+"', estado_tarea_id = "+estado+" WHERE id = "+id;
    console.log(sql);
    conex.query(sql, function(error, resultado, fields){
        if (error) {
            console.log("Ha ocurrido un error en la consulta", error.message);
            return res.status(404).send("Ha ocurrido un error en la consulta");
        }
        req.flash('success_msg', 'Tarea Actualizada');
        res.redirect('/tarea');
    });
}


module.exports = {
    getTareas,
    tareaRender,
    newTarea,
    tareaEditRender,
    tareaEdit
};
