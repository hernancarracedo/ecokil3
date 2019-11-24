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
      res.render('cliente/new-cliente', {
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


async function clienteEditRender(req, res){
    if (!isNaN(req.params.id)) { ////// solo la primera vez entra y luego vuelve a intentar  ??????
        sql = `select id_cliente, tx_cliente, CLI.id_tipo_cliente, tx_tipo_cliente, observaciones, fecha_alta as fecha2, DATE_FORMAT(fecha_alta, '%Y-%m-%d') as fecha_alta 
        FROM cliente AS CLI
        LEFT JOIN cliente_tipo as TIP on TIP.id_tipo_cliente = CLI.id_tipo_cliente
        WHERE id_cliente ='`+req.params.id+`'`;
            conex.query(sql, function(error, result_cliente, fields){
            sql = `SELECT id_tipo_cliente, tx_tipo_cliente FROM cliente_tipo WHERE baja is null`;
            conex.query(sql, function(error, result_tipocliente, fields){
                        result_cliente = result_cliente[0];
                        res.render('cliente/edit-cliente', {result_cliente, result_tipocliente, layout:'mainlayout'});
                        
                    });    
                });
    } else {
        console.log('paso si que lo llamen -> GUORNINGGGG!!!!');
    }
}



async function clienteEdit(req, res){
    const {tx_cliente, id_tipo_cliente, fecha_alta, observaciones} = req.body;
    let id = req.params.id;
    console.log ('id :'+id+'\n');
    console.log ('tx_cliente :'+tx_cliente+'\n');
    console.log ('id_tipo_cliente :'+id_tipo_cliente+'\n');
    console.log ('fecha :'+fecha_alta+'\n');
    console.log ('observaciones :'+observaciones+'\n');
    console.log("ID Usuario: "+req.user.id);
    
    sql = "UPDATE cliente SET tx_cliente = '"+tx_cliente+"', id_tipo_cliente = '"+id_tipo_cliente+"', fecha_alta = '"+fecha_alta+"', observaciones = '"+observaciones+"', id_usuario = '"+req.user.id+"' WHERE id_cliente = "+id;
    
    //console.log(sql);
    conex.query(sql, function(error, resultado, fields){
        if (error) {
            console.log("Ha ocurrido un error en la consulta", error.message);
            return res.status(404).send("Ha ocurrido un error en la consulta");
        }
        req.flash('success_msg', 'Cliente Actualizado');
        res.redirect('/cliente');
    });   
}

async function clienteDelete(req, res){
    let id = req.params.id;
    sql = "UPDATE cliente SET baja = DATE_FORMAT(NOW( ) , '%Y-%m-%d') WHERE id_cliente = "+id;
    conex.query(sql, function(error, resultado, fields){
        if (error) {
            console.log("Ha ocurrido un error en la consulta", error.message);
            return res.status(404).send("Ha ocurrido un error en la consulta");
        }
        req.flash('success_msg', 'Cliente Eliminado Exitosamente');
        res.redirect('/cliente');
    });
}

 module.exports = {
    getClientes,
    clienteRender,
    newCliente,
    clienteEditRender,
    clienteEdit,
    clienteDelete
}