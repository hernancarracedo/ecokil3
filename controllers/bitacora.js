var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var dbconfig = require('../config/database');
var conex = mysql.createConnection(dbconfig.connection);

conex.query('USE ' + dbconfig.database);

//Get todos los elementos de la bitacora
async function getBitacoras(req, res){
  sql = `SELECT id_bitacora, BIT.id_cliente, CLI.tx_cliente, BIT.id_bitacora_tipo, TIP.tx_bitacora_tipo, fecha as fecha2, DATE_FORMAT(fecha, '%d/%m/%Y') as fecha, hora, BIT.observaciones, id_user, USU.username
  FROM bitacora as BIT
  LEFT JOIN cliente as CLI on CLI.id_cliente = BIT.id_cliente
  LEFT JOIN bitacora_tipo as TIP on TIP.id_bitacora_tipo = BIT.id_bitacora_tipo
  LEFT JOIN users as USU on USU.id = BIT.id_user
  WHERE BIT.baja is null`;
  conex.query(sql, function(error, resultado, fields){
      if (error) {
          //console.log("Ha ocurrido un error en la consulta", error.message);
          return res.status(404).send("Ha ocurrido un error en la consulta");
      }

      res.render('bitacora/all-bitacora', {resultado, layout: 'mainlayout'});
  });
}


//Render Formulario de nuevo elemento de bitacoragastos nuevos
async function bitacoraRender(req, res){
  sql = "SELECT id_cliente, tx_cliente FROM `cliente` WHERE baja is null";
  conex.query(sql, function(error, result_clientes, fields){
      if (error) {
          console.log("Ha ocurrido un error en la consulta", error.message);
          return res.status(404).send("Ha ocurrido un error en la consulta");
      }
      sql = "SELECT id_bitacora_tipo, tx_bitacora_tipo FROM `bitacora_tipo` WHERE baja is null";
      conex.query(sql, function(error, result_tipos, fields){
          if (error) {
              console.log("Ha ocurrido un error en la consulta", error.message);
              return res.status(404).send("Ha ocurrido un error en la consulta");
          }
          res.render('bitacora/new-bitacora', {result_clientes, result_tipos, layout:'mainlayout'});
      });
  });
}



//Post nuevo elemento Bitacora
async function newBitacora(req, res){
  const {id_cliente, id_bitacora_tipo, fecha, hora, observaciones} = req.body;
  const errors = [];

  if (!fecha) { errors.push({text: 'Ingrese fecha del Gasto.'}); }
  if (!hora) { errors.push({text: 'Ingrese hora.'}); }
  if (!observaciones) { errors.push({text: 'Ingrese observaciones.'}); }
  
  //console.log("id_cliente: "+id_cliente);
  //console.log("id_bitacora_tipo: "+id_bitacora_tipo);
  //console.log("fecha: "+fecha);
  //console.log("hora: "+hora);
  //console.log("observaciones: "+observaciones);
  //console.log("id_usuario: "+ req.user.id);
  
   
  if (errors.length > 0) {
      res.render('bitacora/new-bitacora', {
      errors,
      id_cliente,
      id_bitacora_tipo,
      fecha,
      hora,
      observaciones,
      layout: 'mainlayout'
      });
  } else {
      sql = "INSERT INTO bitacora (`id_cliente`, `id_bitacora_tipo`, `fecha`, `hora`, `observaciones`, `id_user`) VALUES ('" + id_cliente + "', '" + id_bitacora_tipo + "', '" + fecha + "', '" + hora + "', '" + observaciones + "', '"+ req.user.id +"')";
      //console.log ("asi queda consulta:\n" + sql);
      conex.query(sql, function(error, resultado, fields){
          if (error) {
              console.log("Ha ocurrido un error en la consulta", error.message);
              return res.status(404).send("Ha ocurrido un error en la consulta");
          }
          req.flash('success_msg', 'Nuevo elemento Agregado a BITACORA');
          res.redirect('/bitacora');
      });
  }
}


async function bitacoraEditRender(req, res){
    sql = `SELECT id_bitacora, BIT.id_cliente, CLI.tx_cliente, BIT.id_bitacora_tipo, TIP.tx_bitacora_tipo, fecha as fecha2, DATE_FORMAT(fecha, '%Y-%m-%d') as fecha, hora, BIT.observaciones, id_user, USU.username
        FROM bitacora as BIT
        LEFT JOIN cliente as CLI on CLI.id_cliente = BIT.id_cliente
        LEFT JOIN bitacora_tipo as TIP on TIP.id_bitacora_tipo = BIT.id_bitacora_tipo
        LEFT JOIN users as USU on USU.id = BIT.id_user
        WHERE id_bitacora ='`+req.params.id+`'`;
    conex.query(sql, function(error, result_bitacora, fields){

        sql = "SELECT id_cliente, tx_cliente FROM `cliente` WHERE baja is null";
        conex.query(sql, function(error, result_clientes, fields){

            sql = "SELECT id_bitacora_tipo, tx_bitacora_tipo FROM `bitacora_tipo` WHERE baja is null";
            conex.query(sql, function(error, result_tipos, fields){
                result_bitacora = result_bitacora[0];
                res.render('bitacora/edit-bitacora', {result_bitacora, result_clientes, result_tipos, layout:'mainlayout'});
            });
        });
    }); 
}

async function bitacoraEdit(req, res){
    const {id_cliente, id_bitacora_tipo, fecha, hora, observaciones} = req.body;
    let id = req.params.id;
    //console.log ('id :'+id+'\n');
    //console.log ('id_tipo :'+id_tipo+'\n');
    //console.log ('fecha :'+fecha+'\n');
    //console.log ('observaciones :'+observaciones+'\n');
    //console.log ('monto :'+monto+'\n');
    //console.log ('id_billetera :'+id_billetera+'\n');
    //console.log ('id_forma_pago :'+id_forma_pago+'\n');
    //console.log ('vencimiento :'+vencimiento+'\n');
        
    sql = "UPDATE bitacora SET id_cliente = '"+id_cliente+"', id_bitacora_tipo = '"+id_bitacora_tipo+"', fecha = '"+fecha+"', hora = '"+hora+"', observaciones = '"+observaciones+"', id_user = '"+req.user.id+"' WHERE id_bitacora = "+id;
    
    conex.query(sql, function(error, resultado, fields){
        if (error) {
            console.log("Ha ocurrido un error en la consulta", error.message);
            return res.status(404).send("Ha ocurrido un error en la consulta");
        }
        req.flash('success_msg', 'Elemento de bitacora Actualizado');
        res.redirect('/bitacora');
    });
}



async function bitacoraDelete(req, res){
    let id = req.params.id;
    
    sql = "UPDATE bitacora SET baja = DATE_FORMAT(NOW( ) , '%Y-%m-%d') WHERE id_bitacora = "+id;
    conex.query(sql, function(error, resultado, fields){
        if (error) {
            console.log("Ha ocurrido un error en la consulta", error.message);
            return res.status(404).send("Ha ocurrido un error en la consulta");
        }
        req.flash('success_msg', 'Elemento de Bitacora Eliminado Exitosamente');
        res.redirect('/bitacora');
    });
}

 module.exports = {
    getBitacoras,
    bitacoraRender,
    newBitacora,
    bitacoraEditRender,
    bitacoraEdit,
    bitacoraDelete
}