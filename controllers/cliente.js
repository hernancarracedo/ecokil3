var mysql = require('mysql');
//var bcrypt = require('bcrypt-nodejs');
var dbconfig = require('../config/database');
var conex = mysql.createConnection(dbconfig.connection);
conex.query('USE ' + dbconfig.database);

//Get todos los Clientes
async function getClientes(req, res){
  sql = `SELECT id_cliente, tx_cliente, TIP.tx_tipo_cliente, fecha_alta as fechaalta, DATE_FORMAT(fecha_alta, '%d/%m/%Y') as fecha_alta, observaciones
  FROM cliente as CLI
  LEFT JOIN cliente_tipo as TIP on TIP.id_tipo_cliente  = CLI.id_tipo_cliente
  WHERE CLI.baja is null`;
  conex.query(sql, function(error, resultado, fields){
      if (error) {
          //console.log("Ha ocurrido un error en la consulta", error.message);
          return res.status(404).send("Ha ocurrido un error en la consulta");
      }
      res.render('cliente/all-cliente', {resultado, layout: 'mainlayout'});
  });   
}

//Render Formulario de gastos nuevos
async function clienteRender(req, res){
  sql = `SELECT id_tipo_cliente, tx_tipo_cliente FROM cliente_tipo WHERE baja is null`;
  conex.query(sql, function(error, result_tipocliente, fields){
    if (error) {
        console.log("Ha ocurrido un error en la consulta", error.message);
        return res.status(404).send("Ha ocurrido un error en la consulta");
    }
    res.render('cliente/new-cliente', {result_tipocliente, layout:'mainlayout'});
  });
}

//Post Gasto
async function newCliente(req, res){
  const {tx_cliente, id_tipo_cliente, fecha_alta, observaciones, monto, id_billetera, id_forma_pago, vencimiento} = req.body;
  const errors = [];
  if (!tx_cliente) { errors.push({text: 'Ingrese el nombre del cliente.'}); }   
  if (!id_tipo_cliente) { errors.push({text: 'Ingrese tipo de Cliente.'}); }
  if (!fecha_alta) { errors.push({text: 'Ingrese fecha de alta del Cliente.'}); }
   
  console.log("tx_cliente: "+tx_cliente);
  console.log("id_tipo_cliente: "+id_tipo_cliente);
  console.log("fecha-alta: "+fecha_alta);
  console.log("observaciones: "+observaciones);
  console.log("id_usuario: "+req.user.id);
   
  if (errors.length > 0) {
      res.render('gasto/new-gasto', {
      errors,
      tx_cliente,
      id_tipo_cliente,
      fecha_alta,
      observaciones,
      layout: 'mainlayout'
      });
  } else {
      sql = "INSERT INTO cliente (`tx_cliente`, `id_tipo_cliente`, `fecha_alta`, `observaciones`, `id_usuario`) VALUES ('" + tx_cliente + "','" + id_tipo_cliente + "', '" + fecha_alta + "', '" + observaciones + "', '"+req.user.id+"')";
      console.log ("asi queda consulta:\n" + sql);
      conex.query(sql, function(error, resultado, fields){
          if (error) {
              console.log("Ha ocurrido un error en la consulta", error.message);
              return res.status(404).send("Ha ocurrido un error en la consulta");
          }
          req.flash('success_msg', 'Nuevo Cliente Agregado');
          res.redirect('/cliente');
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
    getClientes,
    clienteRender,
    newCliente
    //gastoEditRender,
    //gastoEdit,
    //gastoDelete
}
