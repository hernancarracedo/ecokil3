var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var dbconfig = require('../config/database');
var conex = mysql.createConnection(dbconfig.connection);

conex.query('USE ' + dbconfig.database);

//Get todos los Gastos
async function getVisitasmip(req, res){
  sql = `SELECT id_visitamip, tx_tipo_visitamip, fecha as fecha2, DATE_FORMAT(fecha, '%d/%m/%Y') as fecha, tx_cliente, remito, observaciones
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

//Post Gasto
async function newVisitamip(req, res){
  const {id_cliente, id_tipo_visitamip, fecha, remito, observaciones} = req.body;
  const errors = [];
  if (!id_cliente) { errors.push({text: 'Ingrese tipo de Gasto.'}); }
  if (!id_tipo_visitamip) { errors.push({text: 'Ingrese tipo de Gasto.'}); }  
  if (!fecha) { errors.push({text: 'Ingrese fecha del Gasto.'}); }
  if (!observaciones) { errors.push({text: 'Ingrese alguna observacion del Gasto.'}); }
  
  console.log("id_cliente: "+id_cliente);
  console.log("id_tipo_visitamip: "+id_tipo_visitamip);
  console.log("fecha: "+fecha);
  console.log("observaciones: "+observaciones);
  console.log("ID Usuario: "+req.user.id);
  console.log("Remito: "+remito);
  
  if (errors.length > 0) {
      res.render('visita/new-visitamip', {
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

/*
async function gastoEditRender(req, res){
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


async function gastoEdit(req, res){
    //const {nombre, descripcion, relevancia, responsable, vencimiento, estado} = req.body;
    //const {nombre, descripcion, relevancia, responsable, vencimiento} = req.body;
    const {id_tipo, fecha, observaciones, monto, id_billetera, id_forma_pago, vencimiento} = req.body;
    let id = req.params.id;
    console.log ('id :'+id+'\n');
    console.log ('id_tipo :'+id_tipo+'\n');
    console.log ('fecha :'+fecha+'\n');
    console.log ('observaciones :'+observaciones+'\n');
    console.log ('monto :'+monto+'\n');
    console.log ('id_billetera :'+id_billetera+'\n');
    console.log ('id_forma_pago :'+id_forma_pago+'\n');
    console.log ('vencimiento :'+vencimiento+'\n');
    
    
    sql = "UPDATE gasto SET id_tipo = '"+id_tipo+"', fecha = '"+fecha+"', observaciones = '"+observaciones+"', monto = '"+monto+"', id_billetera = '"+id_billetera+"', id_forma_pago = '"+id_forma_pago+"', vencimiento = '"+vencimiento+"' WHERE id_gasto = "+id;
    
    //console.log(sql);
    conex.query(sql, function(error, resultado, fields){
        if (error) {
            console.log("Ha ocurrido un error en la consulta", error.message);
            return res.status(404).send("Ha ocurrido un error en la consulta");
        }
        req.flash('success_msg', 'Gasto Actualizado');
        res.redirect('/gasto');
    });
    
   
}

async function gastoDelete(req, res){
    //const {id_tipo, fecha, observaciones, monto, id_billetera, id_forma_pago, vencimiento} = req.body;
    let id = req.params.id;
    
    sql = "UPDATE gasto SET baja = DATE_FORMAT(NOW( ) , '%Y-%m-%d') WHERE id_gasto = "+id;
    conex.query(sql, function(error, resultado, fields){
        if (error) {
            console.log("Ha ocurrido un error en la consulta", error.message);
            return res.status(404).send("Ha ocurrido un error en la consulta");
        }
        req.flash('success_msg', 'Gasto Eliminado Exitosamente');
        res.redirect('/gasto');
    });
}
*/

 module.exports = {
    getVisitasmip,
    visitamipRender,
    newVisitamip
    //gastoEditRender,
    //gastoEdit,
    //gastoDelete
}