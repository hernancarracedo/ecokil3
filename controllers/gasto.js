var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var dbconfig = require('../config/database');
var conex = mysql.createConnection(dbconfig.connection);

conex.query('USE ' + dbconfig.database);

//Get todos los Gastos
async function getGastos(req, res){
  //sql = "SELECT * FROM gasto";
  sql = `SELECT id_gasto, GAS.id_tipo, tx_tipo, fecha, observaciones, monto, GAS.id_billetera, tx_billetera, GAS.id_forma_pago, tx_forma_pago, tx_grupo, vencimiento, GAS.baja
  FROM gasto as GAS 
  LEFT JOIN gasto_tipo as TIP on TIP.id_tipo = GAS.id_tipo
  LEFT JOIN gasto_grupo as GRU on GRU.id_grupo = TIP.id_grupo
  LEFT JOIN gasto_billetera as BIL on BIL.id_billetera = GAS.id_billetera
  LEFT JOIN gasto_forma_pago as FP on FP.id_forma_pago = GAS.id_forma_pago
  WHERE GAS.baja is null`;
  conex.query(sql, function(error, resultado, fields){
      if (error) {
          //console.log("Ha ocurrido un error en la consulta", error.message);
          return res.status(404).send("Ha ocurrido un error en la consulta");
      }

      res.render('gasto/all-gasto', {resultado, layout: 'mainlayout'});
  });
}

//Render Formulario de gastos nuevos
async function gastoRender(req, res){
  sql = `SELECT id_tipo, CONCAT(' [ ', tx_grupo , ' ] ', tx_tipo) as categoria FROM gasto_tipo as TIP
  LEFT JOIN gasto_grupo as GRU on GRU.id_grupo = TIP.id_grupo
  WHERE TIP.baja = 0`;
  conex.query(sql, function(error, result_categorias, fields){
      if (error) {
          console.log("Ha ocurrido un error en la consulta", error.message);
          return res.status(404).send("Ha ocurrido un error en la consulta");
      }
      sql = "SELECT id_billetera, tx_billetera FROM `gasto_billetera` WHERE baja = 0";
      conex.query(sql, function(error, result_billetera, fields){
          if (error) {
              console.log("Ha ocurrido un error en la consulta", error.message);
              return res.status(404).send("Ha ocurrido un error en la consulta");
          }
          sql = "SELECT id_forma_pago, tx_forma_pago FROM `gasto_forma_pago` WHERE baja = 0";
          conex.query(sql, function(error, result_formapago, fields){
              if (error) {
                  console.log("Ha ocurrido un error en la consulta", error.message);
                  return res.status(404).send("Ha ocurrido un error en la consulta");
              }

              res.render('gasto/new-gasto', {result_categorias, result_billetera, result_formapago, layout:'null'});
          });
      });

  });
}

//Post Gasto
async function newGasto(req, res){
  const {id_tipo, fecha, observaciones, monto, id_billetera, id_forma_pago, vencimiento} = req.body;
  const errors = [];
  if (!id_tipo) { errors.push({text: 'Ingrese tipo de Gasto.'}); }
  if (!fecha) { errors.push({text: 'Ingrese fecha del Gasto.'}); }
  if (!observaciones) { errors.push({text: 'Ingrese alguna observacion del Gasto.'}); }
  if (!monto) { errors.push({text: 'Ingrese el monto del Gasto.'}); }    
  if (!id_billetera) { errors.push({text: 'Seleccione quien pagó Gasto.'}); }    
  if (!id_forma_pago) { errors.push({text: 'Seleccione forma de pago del Gasto.'}); }    
  
  console.log("id_tipo: "+id_tipo);
  console.log("fecha: "+fecha);
  console.log("observaciones: "+observaciones);
  console.log("monto: "+monto);
  console.log("id_billetera: "+id_billetera);
  console.log("id_forma_pago: "+id_forma_pago);
  console.log("vencimiento: "+vencimiento);
  
   
  if (errors.length > 0) {
      res.render('gasto/new-gasto', {
      errors,
      id_tipo,
      fecha,
      observaciones,
      monto,
      id_billetera,
      id_forma_pago,
      vencimiento,
      layout: 'mainlayout'
      });
  } else {
      sql = "INSERT INTO gasto (`id_tipo`, `fecha`, `observaciones`, `monto`, `id_billetera`, `id_forma_pago`, `vencimiento`) VALUES ('" + id_tipo + "', '" + fecha + "', '" + observaciones + "', '"+monto+"', '"+id_billetera+"', '"+id_forma_pago+"', '"+vencimiento+"')";
      console.log ("asi queda consulta:\n" + sql);
      conex.query(sql, function(error, resultado, fields){
          if (error) {
              console.log("Ha ocurrido un error en la consulta", error.message);
              return res.status(404).send("Ha ocurrido un error en la consulta");
          }
          req.flash('success_msg', 'Nuevo GASTO Agregado');
          res.redirect('/gasto');
      });
  }
}


function gastoEditRender(req, res){
    if (!isNaN(req.params.id)) { ////// solo la primera vez entra y luego vuelve a intentar  ??????
        sql = `SELECT id_gasto, GAS.id_tipo, CONCAT(' [ ', tx_grupo , ' ] ', tx_tipo) as categoria, fecha, observaciones, monto, GAS.id_billetera, tx_billetera, GAS.id_forma_pago, tx_forma_pago, tx_grupo, vencimiento, GAS.baja
        FROM gasto as GAS 
        LEFT JOIN gasto_tipo as TIP on TIP.id_tipo = GAS.id_tipo
        LEFT JOIN gasto_grupo as GRU on GRU.id_grupo = TIP.id_grupo
        LEFT JOIN gasto_billetera as BIL on BIL.id_billetera = GAS.id_billetera
        LEFT JOIN gasto_forma_pago as FP on FP.id_forma_pago = GAS.id_forma_pago
        WHERE id_gasto ='`+req.params.id+`'`;
        conex.query(sql, function(error, result_gasto, fields){
            sql = "select id_billetera, tx_billetera from gasto_billetera WHERE baja is null";
            conex.query(sql, function(error, result_billetera, fields){
                sql = "select id_forma_pago, tx_forma_pago from gasto_forma_pago WHERE baja is null";
                conex.query(sql, function(error, result_formapago, fields){
                    sql = `SELECT id_tipo, CONCAT(' [ ', tx_grupo , ' ] ', tx_tipo) as categoria FROM gasto_tipo as TIP
                    LEFT JOIN gasto_grupo as GRU on GRU.id_grupo = TIP.id_grupo
                    WHERE TIP.baja is null`;
                    conex.query(sql, function(error, result_categorias, fields){
                        result_gasto = result_gasto[0];
                        res.render('gasto/edit-gasto', {result_gasto, result_billetera, result_formapago, result_categorias, layout:'mainlayout'});
                        
                    });    
                });
            });
        }); 
    } else {
        console.log('paso si que lo llamen -> GUORNINGGGG!!!!');
    }
}


/*
async function esoEdit(req, res){
 const { deliveryTicket, estado } = req.body;
  await Eso.findByIdAndUpdate(req.params.id, {deliveryTicket, estado});
  req.flash('success_msg', 'ESO Actualizada');
  res.redirect('/eso');
}


async function esoDelete(req, res){
   await Eso.findByIdAndDelete(req.params.id);
  req.flash('success_msg', 'ESO borrada correctamente');
  res.redirect('/eso')
}
*/


 module.exports = {
    getGastos,
    gastoRender,
    newGasto,
    gastoEditRender
    //gastoEdit
    //esoDelete
}
