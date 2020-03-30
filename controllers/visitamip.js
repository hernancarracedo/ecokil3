var mysql = require('mysql');
//var bcrypt = require('bcrypt-nodejs');
var dbconfig = require('../config/database');
var conex = mysql.createConnection(dbconfig.connection);

conex.query('USE ' + dbconfig.database);

//Get todos los Gastos
async function getVisitasmip(req, res){
  sql = `SELECT id_visitamip, tx_tipo_visitamip, fecha as fecha2, DATE_FORMAT(fecha, '%d/%m/%Y') as fecha, tx_cliente, remito, VMP.observaciones
  FROM visitamip as VMP
  LEFT JOIN cliente as CLI on CLI.id_cliente = VMP.id_cliente
  LEFT JOIN visitamip_tipo as TIP on TIP.id_tipo_visitamip = VMP.id_tipo_visitamip
  WHERE VMP.baja is null`;
  conex.query(sql, function(error, resultado, fields){
      if (error) {
          return res.status(404).send("Ha ocurrido un error en la consulta");
      }
      res.render('visitamip/all-visitamip', {resultado, layout: 'mainlayout'});
  });
}

//Render Formulario de gastos nuevos
async function visitamipRender(req, res){
    sql = "SELECT id_cliente, tx_cliente FROM `cliente` WHERE baja is null";
    conex.query(sql, function(error, result_cliente, fields){
        if (error) {
            console.log("Ha ocurrido un error en la consulta", error.message);
            return res.status(404).send("Ha ocurrido un error en la consulta");
        }
        sql = "SELECT id_tipo_visitamip, tx_tipo_visitamip FROM `visitamip_tipo` WHERE baja is null";
        conex.query(sql, function(error, result_tipovisitamip, fields){
            if (error) {
                console.log("Ha ocurrido un error en la consulta", error.message);
                return res.status(404).send("Ha ocurrido un error en la consulta");
            }
            res.render('visitamip/new-visitamip', {result_cliente, result_tipovisitamip, layout:'mainlayout'});
          });
    });
}

//Post visitamip
async function newVisitamip(req, res){
  const {id_cliente, id_tipo_visitamip, fecha, remito, observaciones} = req.body;
  const file = req.file;
  const errors = [];
  if (!id_cliente) { errors.push({text: 'Ingrese Cliente.'}); }
  if (!id_tipo_visitamip) { errors.push({text: 'Ingrese tipo de Visita.'}); }  
  if (!fecha) { errors.push({text: 'Ingrese fecha de la visita.'}); }
  if (!observaciones) { errors.push({text: 'Ingrese alguna observacion de la Visita.'}); }
  
  console.log("id_cliente: "+id_cliente);
  console.log("id_tipo_visitamip: "+id_tipo_visitamip);
  console.log("fecha: "+fecha);
  console.log("observaciones: "+observaciones);
  console.log("ID Usuario: "+req.user.id);
  console.log("Remito: "+remito);
  console.log("archivo: "+file.originalname);
  
  if (errors.length > 0) {
      res.render('visitamip/new-visitamip', {
      errors,
      id_cliente,
      id_tipo_visitamip,
      fecha,
      remito,
      observaciones,
      layout: 'mainlayout'
      });
  } else {
      sql = "INSERT INTO visitamip (`id_cliente`, `id_tipo_visitamip`, `fecha`, `remito`, `observaciones`, `id_usuario`) VALUES ('" + id_cliente + "', '" + id_tipo_visitamip + "', '" + fecha + "', '"+ remito +"', '"+observaciones+"', '"+req.user.id+"')";
      console.log ("asi queda consulta:" + sql);
      conex.query(sql, function(error, resultado, fields){
          if (error) {
              console.log("Ha ocurrido un error en la consulta", error.message);
              return res.status(404).send("Ha ocurrido un error en la consulta");
          }
          req.flash('success_msg', 'Nueva Visita por Servicio Agregada');
          res.redirect('/visitamip');
      });
  }
}


async function visitamipEditRender(req, res){
    if (!isNaN(req.params.id)) { ////// solo la primera vez entra y luego vuelve a intentar  ??????
        sql = `SELECT id_visitamip, VMP.id_tipo_visitamip, tx_tipo_visitamip, fecha as fecha2, DATE_FORMAT(fecha, '%Y-%m-%d') as fecha, VMP.id_cliente, tx_cliente, remito, VMP.observaciones
        FROM visitamip as VMP
        LEFT JOIN cliente as CLI on CLI.id_cliente = VMP.id_cliente
        LEFT JOIN visitamip_tipo as TIP on TIP.id_tipo_visitamip = VMP.id_tipo_visitamip
        WHERE id_visitamip ='`+req.params.id+`'`;
        conex.query(sql, function(error, result_visitamip, fields){
            sql = "SELECT id_cliente, tx_cliente FROM `cliente` WHERE baja is null";
            conex.query(sql, function(error, result_cliente, fields){
                sql = "SELECT id_tipo_visitamip, tx_tipo_visitamip FROM `visitamip_tipo` WHERE baja is null";
                conex.query(sql, function(error, result_tipovisitamip, fields){
                    sql = `SELECT id_tipo, CONCAT(' [ ', tx_grupo , ' ] ', tx_tipo) as categoria FROM gasto_tipo as TIP
                    LEFT JOIN gasto_grupo as GRU on GRU.id_grupo = TIP.id_grupo
                    WHERE TIP.baja is null`;
                    conex.query(sql, function(error, result_categorias, fields){
                        result_visitamip = result_visitamip[0];
                        res.render('visitamip/edit-visitamip', {result_visitamip, result_cliente, result_tipovisitamip, layout:'mainlayout'});
                    });    
                });
            });
        });    
    } else {
        console.log('paso si que lo llamen -> GUORNINGGGG!!!!');
    }
}


async function visitamipEdit(req, res){
    const {id_tipo_visitamip, id_cliente, fecha, observaciones, remito} = req.body;
    let id = req.params.id;
    console.log ('id :'+id+'\n');
    console.log ('id_tipo_visitamip :'+id_tipo_visitamip+'\n');
    console.log ('id_cliente :'+id_cliente+'\n');
    console.log ('fecha :'+fecha+'\n');
    console.log ('observaciones :'+observaciones+'\n');
    console.log ('remito :'+remito+'\n');
    console.log("ID Usuario: "+req.user.id);

    
    
    sql = "UPDATE visitamip SET id_tipo_visitamip = '"+id_tipo_visitamip+"', id_cliente = '"+id_cliente+"', fecha = '"+fecha+"', remito = '"+remito+"', observaciones = '"+observaciones+"', id_usuario = '"+req.user.id+"' WHERE id_visitamip = "+id;
    
    //console.log(sql);
    conex.query(sql, function(error, resultado, fields){
        if (error) {
            console.log("Ha ocurrido un error en la consulta", error.message);
            return res.status(404).send("Ha ocurrido un error en la consulta");
        }
        req.flash('success_msg', 'Registro de Visita Servicio Mip Actualizado');
        res.redirect('/visitamip');
    });
    
   
}

async function visitamipDelete(req, res){
    let id = req.params.id;
    
    sql = "UPDATE visitamip SET baja = DATE_FORMAT(NOW( ) , '%Y-%m-%d') WHERE id_visitamip = "+id;
    conex.query(sql, function(error, resultado, fields){
        if (error) {
            console.log("Ha ocurrido un error en la consulta", error.message);
            return res.status(404).send("Ha ocurrido un error en la consulta");
        }
        req.flash('success_msg', 'Registro de Visita Servicio MIP Eliminado Exitosamente');
        res.redirect('/visitamip');
    });
}


 module.exports = {
    getVisitasmip,
    visitamipRender,
    newVisitamip,
    visitamipEditRender,
    visitamipEdit,
    visitamipDelete
}