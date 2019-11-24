var mysql = require('mysql');
//var bcrypt = require('bcrypt-nodejs');
var dbconfig = require('../config/database');
var conex = mysql.createConnection(dbconfig.connection);

conex.query('USE ' + dbconfig.database);

//Get todos los Movimientos Bancarios
async function getMovisbanco(req, res){
  sql = `SELECT id_movibanco, fecha as fecha2, DATE_FORMAT(fecha, '%d/%m/%Y') as fecha, monto, nro_comprob, MOV.id_movibanco_concepto, tx_movibanco_concepto, concepto, referencia, saldo, observaciones
  FROM movibanco as MOV
  LEFT JOIN movibanco_concepto as CON on CON.id_movibanco_concepto = MOV.id_movibanco_concepto
  WHERE MOV.baja is null
  ORDER BY fecha2`;
  conex.query(sql, function(error, resultado, fields){
      if (error) {
          //console.log("Ha ocurrido un error en la consulta", error.message);
          return res.status(404).send("Ha ocurrido un error en la consulta");
      }

      res.render('movibanco/all-movibanco', {resultado, layout: 'mainlayout'});
  });
}


//Render Formulario de alta movimientos bancarios
async function movibancoRender(req, res){
    sql = "SELECT id_movibanco_concepto, tx_movibanco_concepto FROM `movibanco_concepto` WHERE baja is null";
    conex.query(sql, function(error, result_concepto, fields){
        if (error) {
            console.log("Ha ocurrido un error en la consulta", error.message);
            return res.status(404).send("Ha ocurrido un error en la consulta");
        }
        res.render('movibanco/new-movibanco', {result_concepto, layout:'mainlayout'});
    });
}


//Post Movimiento de cuenta corriente bancaria
async function newMovibanco(req, res){
  const {fecha, monto, nro_comprob, id_movibanco_concepto, concepto, referencia, saldo, observaciones} = req.body;
  const errors = [];
  if (!fecha) { errors.push({text: 'Ingrese fecha del Gasto.'}); }
  if (!monto) { errors.push({text: 'Ingrese el monto del Gasto.'}); }    
  
  console.log("fecha: "+fecha);
  console.log("monto: "+monto);
  console.log("id_billetera: "+nro_comprob);
  console.log("id_movibanco_concepto: "+id_movibanco_concepto);
  console.log("concepto: "+concepto);
  console.log("referencia: "+referencia);
  console.log("saldo: "+saldo);
  console.log("observaciones: "+observaciones);
  console.log("ID Usuario: "+req.user.id);
  
   
  if (errors.length > 0) {
      res.render('movibanco/new-movibanco', {
      errors,
      fecha, 
      monto, 
      nro_comprob, 
      id_movibanco_concepto, 
      concepto, 
      referencia, 
      saldo, 
      observaciones,
      layout: 'mainlayout'
      });
  } else {
      sql = "INSERT INTO movibanco (`fecha`, `monto`, `nro_comprob`, `id_movibanco_concepto`, `concepto`, `referencia`, `saldo`, `observaciones`, `id_usuario`) VALUES ('" + fecha + "', '" + monto + "', '" + nro_comprob + "', '"+id_movibanco_concepto+"', '"+concepto+"', '"+referencia+"', '"+saldo+"', '"+observaciones+"', '"+req.user.id+"')";
      console.log ("asi queda consulta:\n" + sql);
      conex.query(sql, function(error, resultado, fields){
          if (error) {
              console.log("Ha ocurrido un error en la consulta", error.message);
              return res.status(404).send("Ha ocurrido un error en la consulta");
          }
          req.flash('success_msg', 'Nuevo Movimiento de Cuenta Bancaria Agregado');
          res.redirect('/movibanco');
      });
  }
}

async function movibancoEditRender(req, res){
    sql = `SELECT id_movibanco, fecha as fecha2, DATE_FORMAT(fecha, '%Y-%m-%d') as fecha, monto, nro_comprob, MOV.id_movibanco_concepto, tx_movibanco_concepto, concepto, referencia, saldo, observaciones
    FROM movibanco as MOV 
    LEFT JOIN movibanco_concepto as CON on CON.id_movibanco_concepto = MOV.id_movibanco_concepto
    WHERE id_movibanco ='`+req.params.id+`'`;
    conex.query(sql, function(error, result_movibanco, fields){
        sql = "select id_movibanco_concepto, tx_movibanco_concepto from movibanco_concepto WHERE baja is null";
        conex.query(sql, function(error, result_concepto, fields){
            result_movibanco = result_movibanco[0];
            res.render('movibanco/edit-movibanco', {result_movibanco, result_concepto, layout:'mainlayout'});
        });    
    });
}


async function movibancoEdit(req, res){
    const {fecha, monto, nro_comprob, id_movibanco_concepto, concepto, referencia, saldo, observaciones} = req.body;
    //const {id_tipo, fecha, observaciones, monto, id_billetera, id_forma_pago, vencimiento} = req.body;
    let id = req.params.id;
    console.log ('id :'+id+'\n');
    console.log ('fecha :'+fecha+'\n');
    console.log ('monto :'+monto+'\n');
    console.log ('nro_comprob :'+nro_comprob+'\n');
    console.log ('id_movibanco_concepto :'+id_movibanco_concepto+'\n');
    console.log ('concepto :'+concepto+'\n');
    console.log ('referencia :'+referencia+'\n');
    console.log ('saldo :'+saldo+'\n');
    console.log ('observaciones :'+observaciones+'\n');
    console.log("ID Usuario: "+req.user.id);
    
    sql = "UPDATE movibanco SET fecha = '"+fecha+"', monto = '"+monto+"', nro_comprob = '"+nro_comprob+"', id_movibanco_concepto = '"+id_movibanco_concepto+"', concepto = '"+concepto+"', referencia = '"+referencia+"', saldo = '"+saldo+"', observaciones = '"+observaciones+"', id_usuario = '"+req.user.id+"' WHERE id_movibanco = "+id;
    
    conex.query(sql, function(error, resultado, fields){
        if (error) {
            console.log("Ha ocurrido un error en la consulta", error.message);
            return res.status(404).send("Ha ocurrido un error en la consulta");
        }
        req.flash('success_msg', 'Moviemiento Bancario Actualizado');
        res.redirect('/movibanco');
    });
}

async function movibancoDelete(req, res){
    let id = req.params.id;
    sql = "UPDATE movibanco SET baja = DATE_FORMAT(NOW( ) , '%Y-%m-%d') WHERE id_movibanco = "+id;
    conex.query(sql, function(error, resultado, fields){
        if (error) {
            console.log("Ha ocurrido un error en la consulta", error.message);
            return res.status(404).send("Ha ocurrido un error en la consulta");
        }
        req.flash('success_msg', 'Movimiento Bancario Eliminado Exitosamente');
        res.redirect('/movibanco');
    });
}


 module.exports = {
    getMovisbanco,
    movibancoRender,
    newMovibanco,
    movibancoEditRender,
    movibancoEdit,
    movibancoDelete
}