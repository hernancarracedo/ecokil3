var mysql = require('mysql');
//var bcrypt = require('bcrypt-nodejs');
var dbconfig = require('../config/database');
var conex = mysql.createConnection(dbconfig.connection);
conex.query('USE ' + dbconfig.database);

//Get todos los Contactos
async function getContactos(req, res){
  sql = `SELECT id_contacto, tx_contacto, CTO.id_tipo_contacto, tx_tipo_contacto, CTO.id_cliente, tx_cliente, mail, celular, telefono2, CTO.observaciones
  FROM contacto as CTO
  LEFT JOIN contacto_tipo as TIP on TIP.id_tipo_contacto  = CTO.id_tipo_contacto
  LEFT JOIN cliente as CLI on CLI.id_cliente  = CTO.id_cliente
  WHERE CTO.baja is null`;
  conex.query(sql, function(error, resultado, fields){
      if (error) {
          //console.log("Ha ocurrido un error en la consulta", error.message);
          return res.status(404).send("Ha ocurrido un error en la consulta");
      }
      res.render('contacto/all-contacto', {resultado, layout: 'mainlayout'});
  });   
}

//Render Formulario de Contactos nuevos
async function contactoRender(req, res){
    sql = "select id_tipo_contacto, tx_tipo_contacto from contacto_tipo WHERE baja is null";
    conex.query(sql, function(error, result_tipocontacto, fields){
        if (error) {
            console.log("Ha ocurrido un error en la consulta", error.message);
            return res.status(404).send("Ha ocurrido un error en la consulta");
        }
        sql = "select id_cliente, tx_cliente from cliente WHERE baja is null";
        conex.query(sql, function(error, result_cliente, fields){
            if (error) {
                console.log("Ha ocurrido un error en la consulta", error.message);
                return res.status(404).send("Ha ocurrido un error en la consulta");
            }
            res.render('contacto/new-contacto', {result_tipocontacto, result_cliente, layout:'mainlayout'});
        });

    });
}

//Post Contacto
async function newContacto(req, res){
  const {tx_contacto, id_cliente, id_tipo_contacto, mail, celular, telefono2, observaciones} = req.body;
  const errors = [];
  if (!tx_contacto) { errors.push({text: 'Ingrese el nombre del contacto.'}); }   
  if (!id_tipo_contacto) { errors.push({text: 'Seleccione una categoria de contacto.'}); }

   
  console.log("tx_contacto: "+tx_contacto);
  console.log("id_cliente: "+id_cliente);
  console.log("id_tipo_contacto: "+id_tipo_contacto);
  console.log("mail: "+mail);
  console.log("celular: "+celular);
  console.log("telefono2: "+telefono2);
  console.log("observaciones: "+observaciones);
  console.log("id_usuario: "+req.user.id);
   
  if (errors.length > 0) {
      res.render('contacto/new-contacto', {
      errors,
      tx_contacto, 
      id_cliente, 
      id_tipo_contacto, 
      mail, 
      celular, 
      telefono2, 
      observaciones,      
      layout: 'mainlayout'
      });
  } else {
      sql = "INSERT INTO contacto (`tx_contacto`, `id_tipo_contacto`, `id_cliente`, `mail`, `celular`, `telefono2`, `observaciones`, `id_usuario`) VALUES ('" + tx_contacto + "','" + id_tipo_contacto + "', '" + id_cliente + "', '" + mail + "', '" + celular + "', '" + telefono2 + "', '" + observaciones + "', '"+req.user.id+"')";
      console.log ("asi queda consulta:\n" + sql);
      conex.query(sql, function(error, resultado, fields){
          if (error) {
              console.log("Ha ocurrido un error en la consulta", error.message);
              return res.status(404).send("Ha ocurrido un error en la consulta");
          }
          req.flash('success_msg', 'Nuevo Contacto Agregado');
          res.redirect('/contacto');
      });
  }
}
/* 
SEGUIR POR ACÁ
SEGUIR POR ACÁ %%%%%%%%%%%%%%%%%%
SEGUIR POR ACÁ
*/

function contactoEditRender(req, res){
    //if (!isNaN(req.params.id)) { ////// solo la primera vez entra y luego vuelve a intentar  ??????
        sql = `SELECT id_contacto, tx_contacto, CTO.id_tipo_contacto, tx_tipo_contacto, CTO.id_cliente, tx_cliente, mail, celular, telefono2, CTO.observaciones
        FROM contacto as CTO 
        LEFT JOIN contacto_tipo as TIP on TIP.id_tipo_contacto = CTO.id_tipo_contacto
        LEFT JOIN cliente as CLI on CLI.id_cliente = CTO.id_cliente
        WHERE id_contacto ='`+req.params.id+`'`;
        conex.query(sql, function(error, result_contacto, fields){
            sql = "select id_tipo_contacto, tx_tipo_contacto from contacto_tipo WHERE baja is null";
            conex.query(sql, function(error, result_tipocontacto, fields){
                sql = "select id_cliente, tx_cliente FROM cliente WHERE baja is null";
                conex.query(sql, function(error, result_cliente, fields){
                    result_contacto = result_contacto[0];
                    res.render('contacto/edit-contacto', {result_contacto, result_tipocontacto, result_cliente, layout:'mainlayout'});
                });
            });
        }); 
    //} else {
      //  console.log('paso si que lo llamen -> GUORNINGGGG!!!!');
   // }
}

async function contactoEdit(req, res){
    const {tx_contacto, id_cliente, id_tipo_contacto, mail, celular, telefono2, observaciones} = req.body;
    let id = req.params.id;
    console.log ('id :'+id+'\n');
    console.log ('tx_contacto :'+tx_contacto+'\n');
    console.log ('id_cliente :'+id_cliente+'\n');
    console.log ('id_tipo_contacto :'+id_tipo_contacto+'\n');
    console.log ('mail :'+mail+'\n');
    console.log ('celular :'+celular+'\n');
    console.log ('telefono2 :'+telefono2+'\n');    
    console.log ('observaciones :'+observaciones+'\n');
    console.log("ID Usuario: "+req.user.id);
    
    sql = "UPDATE contacto SET tx_contacto = '"+tx_contacto+"', id_cliente = '"+id_cliente+"', id_tipo_contacto = '"+id_tipo_contacto+"', mail = '"+mail+"', celular = '"+celular+"', telefono2 = '"+telefono2+"', observaciones = '"+observaciones+"', id_usuario = '"+req.user.id+"' WHERE id_contacto = "+id;
    
    conex.query(sql, function(error, resultado, fields){
        if (error) {
            console.log("Ha ocurrido un error en la consulta", error.message);
            return res.status(404).send("Ha ocurrido un error en la consulta");
        }
        req.flash('success_msg', 'Contacto Actualizado');
        res.redirect('/contacto');
    });   
}

async function contactoDelete(req, res){
    let id = req.params.id;
    sql = "UPDATE contacto SET baja = DATE_FORMAT(NOW( ) , '%Y-%m-%d') WHERE id_contacto = "+id;
    conex.query(sql, function(error, resultado, fields){
        if (error) {
            console.log("Ha ocurrido un error en la consulta", error.message);
            return res.status(404).send("Ha ocurrido un error en la consulta");
        }
        req.flash('success_msg', 'Contacto Eliminado Exitosamente');
        res.redirect('/contacto');
    });
}

 module.exports = {
    getContactos,
    contactoRender,
    newContacto,
    contactoEditRender,
    contactoEdit,
    contactoDelete
}