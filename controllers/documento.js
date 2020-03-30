var mysql = require('mysql');
//var bcrypt = require('bcrypt-nodejs');
var dbconfig = require('../config/database');
var conex = mysql.createConnection(dbconfig.connection);

conex.query('USE ' + dbconfig.database);

//Get todos los Documentos
function getDocumentos(req, res){
  sql = `SELECT id_docu, tx_docu, tx_docu_tipo, tx_cliente, fecha as fecha2, DATE_FORMAT(fecha, '%d/%m/%Y') as fecha, ruta_docu, DOC.observaciones
  FROM documento as DOC
  LEFT JOIN cliente as CLI on CLI.id_cliente = DOC.id_cliente
  LEFT JOIN documento_tipo as TIP on TIP.id_docu_tipo = DOC.id_docu_tipo
  WHERE DOC.baja is null`;
  conex.query(sql, function(error, resultado, fields){
      if (error) {
          return res.status(404).send("Ha ocurrido un error en la consulta");
      }
      res.render('documento/all-documento', {resultado, layout: 'mainlayout'});
  });
}

//Render Formulario de documento nuevo
function documentoRender(req, res){
    sql = "SELECT id_cliente, tx_cliente FROM `cliente` WHERE baja is null";
    conex.query(sql, function(error, result_cliente, fields){
        if (error) {
            console.log("Ha ocurrido un error en la consulta", error.message);
            return res.status(404).send("Ha ocurrido un error en la consulta");
        }
        sql = "SELECT id_docu_tipo, tx_docu_tipo FROM `documento_tipo` WHERE baja is null";
        conex.query(sql, function(error, result_tipodocu, fields){
            if (error) {
                console.log("Ha ocurrido un error en la consulta", error.message);
                return res.status(404).send("Ha ocurrido un error en la consulta");
            }
            res.render('documento/new-documento', {result_cliente, result_tipodocu, layout:'mainlayout'});
          });
    });
}

//Post documento
async function newDocumento(req, res){
  const {tx_docu, id_docu_tipo, id_cliente, observaciones} = req.body;
  const file = req.file;
  const errors = [];
  if (!file) { errors.push({text: 'No ha seleccionado ningun documento.'}); }  
  if (!tx_docu) { errors.push({text: 'Indique un nombre para el documento.'}); }  
  if (!id_docu_tipo) { errors.push({text: 'Ingrese tipo de Documento.'}); }  
  if (!id_cliente) { errors.push({text: 'Ingrese Cliente.'}); }
  if (!observaciones) { errors.push({text: 'Ingrese alguna observacion del documento.'}); }
  
  console.log("Nombre: "+tx_docu);
  console.log("id_cliente: "+id_cliente);
  console.log("id_tipo_visitamip: "+id_docu_tipo);
  console.log("observaciones: "+observaciones);
  console.log("ID Usuario: "+req.user.id);
  console.log("archivo: "+file.originalname);
  
  if (errors.length > 0) {
      res.render('documento/new-documento', {
      errors,
      tx_docu, 
      id_docu_tipo, 
      id_cliente, 
      observaciones,
      layout: 'mainlayout'
      });
  } else {
      sql = `INSERT INTO documento (tx_docu, id_docu_tipo, id_cliente, fecha, ruta_docu, id_usuario, observaciones) VALUES ('` + tx_docu + `', '` + id_docu_tipo + `', '` + id_cliente + `', DATE_FORMAT(NOW( ) , '%Y-%m-%d'), '/uploads/documentos/`+file.filename+`', '`+req.user.id+`', '` + observaciones + `')`;
      console.log ("asi queda consulta:" + sql);
      conex.query(sql, function(error, resultado, fields){
          if (error) {
              console.log("Ha ocurrido un error en la consulta", error.message);
              return res.status(404).send("Ha ocurrido un error en la consulta");
          }
          req.flash('success_msg', 'Nuevo Documento archivado correctamente');
          res.redirect('/documento');
      });
  }
}


function documentoEditRender(req, res){
        sql = `SELECT id_docu, tx_docu, DOC.id_docu_tipo, tx_docu_tipo, DOC.id_cliente, tx_cliente, fecha as fecha2, DATE_FORMAT(fecha, '%Y-%m-%d') as fecha, ruta_docu, DOC.observaciones
        FROM documento as DOC
        LEFT JOIN cliente as CLI on CLI.id_cliente = DOC.id_cliente
        LEFT JOIN documento_tipo as TIP on TIP.id_docu_tipo = DOC.id_docu_tipo
        WHERE id_docu ='`+req.params.id+`'`;
        conex.query(sql, function(error, result_docu, fields){
            sql = "SELECT id_cliente, tx_cliente FROM `cliente` WHERE baja is null";
            conex.query(sql, function(error, result_cliente, fields){
                sql = "SELECT id_docu_tipo, tx_docu_tipo FROM `documento_tipo` WHERE baja is null";
                conex.query(sql, function(error, result_tipodocu, fields){
                    result_docu = result_docu[0];
                    res.render('documento/edit-documento', {result_docu, result_cliente, result_tipodocu, layout:'mainlayout'});    
                });
            });
        });    
}

// put de los cambios en info documento
function documentoEdit(req, res){
    const {tx_docu, id_docu_tipo, id_cliente, observaciones} = req.body;
    let id = req.params.id;
    console.log ('id :'+id+'\n');
    console.log ('tx_docu:'+tx_docu+'\n');    
    console.log ('id_docu_tipo :'+id_docu_tipo+'\n');
    console.log ('id_cliente :'+id_cliente+'\n');
    console.log ('observaciones :'+observaciones+'\n');
    console.log("ID Usuario: "+req.user.id);
    
    sql = "UPDATE documento SET tx_docu = '"+tx_docu+"', id_docu_tipo = '"+id_docu_tipo+"', id_cliente = '"+id_cliente+"', fecha = DATE_FORMAT(NOW( ) , '%Y-%m-%d'), observaciones = '"+observaciones+"', id_usuario = '"+req.user.id+"' WHERE id_docu_tipo = "+id;
    conex.query(sql, function(error, resultado, fields){
        if (error) {
            console.log("Ha ocurrido un error en la consulta", error.message);
            return res.status(404).send("Ha ocurrido un error en la consulta");
        }
        req.flash('success_msg', 'Se modificaron los Datos Anexos al Documento Exitosamente');
        res.redirect('/documento');
    });   
}

// baja logica del registro.
function documentoDelete(req, res){
    let id = req.params.id;
    
    sql = "UPDATE documento SET baja = DATE_FORMAT(NOW( ) , '%Y-%m-%d') WHERE id_docu = "+id;
    conex.query(sql, function(error, resultado, fields){
        if (error) {
            console.log("Ha ocurrido un error en la consulta", error.message);
            return res.status(404).send("Ha ocurrido un error en la consulta");
        }
        req.flash('success_msg', 'Documento eliminado Exitosamente');
        res.redirect('/documento');
    });
}

module.exports = {
    getDocumentos,
    documentoRender,
    newDocumento,
    documentoEditRender,
    documentoEdit,
    documentoDelete
}