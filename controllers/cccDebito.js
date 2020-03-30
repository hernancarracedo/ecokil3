var mysql = require('mysql');
var dbconfig = require('../config/database');
var conex = mysql.createConnection(dbconfig.connection);

conex.query('USE ' + dbconfig.database);

//Get todos los movimientos cuenta corriente clientes
async function getCccDebitos(req, res){
  sql = `SELECT id_movicc, fecha as fecha2, DATE_FORMAT(fecha, '%d/%m/%Y') as fecha, monto, CLI.tx_cliente, COM.tx_movicc_tipo_comprobante, nro_comprobante, tx_movicc_formapago, MCC.observaciones
  FROM movicc as MCC
  LEFT JOIN cliente as CLI on CLI.id_cliente = MCC.id_cliente
  LEFT JOIN movicc_tipo_comprobante as COM on COM.id_movicc_tipo_comprobante = MCC.id_movicc_tipo_comprobante
  LEFT JOIN movicc_formapago as FP on FP.id_movicc_formapago = MCC.id_movicc_formapago
  WHERE MCC.baja is null
  AND MCC.monto < 0`;
  conex.query(sql, function(error, resultado, fields){
      if (error) {
          return res.status(404).send("Ha ocurrido un error en la consulta");
      }
      res.render('cccDebito/all-debito', {resultado, layout: 'mainlayout'});
  });
}


//Render Formulario de alta de DEBITO (o deuda nueva de un cliente)
async function cccDebitoRender(req, res){
    sql = "SELECT id_movicc_tipo_comprobante, tx_movicc_tipo_comprobante FROM `movicc_tipo_comprobante` WHERE baja is null AND tipo_mov ='d'";
    conex.query(sql, function(error, result_comprobante, fields){
        if (error) {
            console.log("Ha ocurrido un error en la consulta", error.message);
            return res.status(404).send("Ha ocurrido un error en la consulta");
        }
        sql = "SELECT id_cliente, tx_cliente FROM `cliente` WHERE baja is null";
        conex.query(sql, function(error, result_cliente, fields){
            if (error) {
                console.log("Ha ocurrido un error en la consulta", error.message);
                return res.status(404).send("Ha ocurrido un error en la consulta");
            }
  
            res.render('cccDebito/new-debito', {result_comprobante, result_cliente, layout:'mainlayout'});
        });
    });
}

  
//Post Movimiento de DEBITO en cuenta corriente cliente (nueva deuda)
async function newCccDebito(req, res){
    const {fecha, monto, id_cliente, id_movicc_tipo_comprobante, nro_comprob, observaciones} = req.body;
    const errors = [];
    if (!fecha) { errors.push({text: 'Ingrese fecha del Debito.'}); }
    if (!monto) { errors.push({text: 'Ingrese el monto del Debito.'}); }    
    if (!id_cliente) { errors.push({text: 'Ingrese el cliente al que corresponde debito.'}); }
    if (!id_movicc_tipo_comprobante) { errors.push({text: 'Ingrese el tipo de comprobante del Debito.'}); }    
    if (!observaciones) { errors.push({text: 'Ingrese alguna observacion sobre el debito.'}); }    
  
    console.log("fecha: "+fecha);
    console.log("monto: "+monto);
    console.log("id_cliente: "+id_cliente);
    console.log("id_movicc_tipo_comprobante: "+id_movicc_tipo_comprobante);
    console.log("nro_comprob: "+nro_comprob);  
    console.log("observaciones: "+observaciones);
    console.log("ID Usuario: "+req.user.id);
    
     
    if (errors.length > 0) {
        res.render('movicc/new-debito', {
        errors,
        fecha, 
        monto,
        id_cliente, 
        id_movicc_tipo_comprobante, 
        nro_comprob, 
        observaciones,
        layout: 'mainlayout'
        });
    } else {
        sql = "INSERT INTO movicc (`fecha`, `monto`, `id_cliente`, `id_movicc_tipo_comprobante`, `nro_comprobante`, `observaciones`, `id_usuario`) VALUES ('" + fecha + "', '-" + monto + "', '" + id_cliente + "', '"+id_movicc_tipo_comprobante+"', '"+nro_comprob+"', '"+observaciones+"', '"+req.user.id+"')";
        console.log ("asi queda consulta:\n" + sql);
        conex.query(sql, function(error, resultado, fields){
            if (error) {
                console.log("Ha ocurrido un error en la consulta", error.message);
                return res.status(404).send("Ha ocurrido un error en la consulta");
            }
            req.flash('success_msg', 'Nuevo Debito en Cuenta Corriente de Cliente Agregado');
            res.redirect('/cccDebito');
        });
    }
  }


function cccDebitoEditRender(req, res){
    sql = `SELECT id_movicc, fecha as fecha2, DATE_FORMAT(fecha, '%Y-%m-%d') as fecha, ((monto)*(-1)) as monto, CLI.id_cliente, CLI.tx_cliente, COM.id_movicc_tipo_comprobante, COM.tx_movicc_tipo_comprobante, nro_comprobante, MCC.observaciones
    FROM movicc as MCC
    LEFT JOIN cliente as CLI on CLI.id_cliente = MCC.id_cliente
    LEFT JOIN movicc_tipo_comprobante as COM on COM.id_movicc_tipo_comprobante = MCC.id_movicc_tipo_comprobante
    WHERE id_movicc = '`+req.params.id+`'`;
    conex.query(sql, function(error, result_debito, fields){
        sql = `SELECT id_cliente, tx_cliente FROM cliente WHERE baja is null`;
        conex.query(sql, function(error, result_cliente, fields){
            if (error) {
                console.log("Ha ocurrido un error en la consulta", error.message);
                return res.status(404).send("Ha ocurrido un error en la consulta");
            }
            sql = "SELECT id_movicc_tipo_comprobante, tx_movicc_tipo_comprobante FROM `movicc_tipo_comprobante` WHERE baja is null AND tipo_mov ='p'";
            conex.query(sql, function(error, result_comprobante, fields){
                if (error) {
                    console.log("Ha ocurrido un error en la consulta", error.message);
                    return res.status(404).send("Ha ocurrido un error en la consulta");
                }
                result_debito =result_debito[0];
                res.render('cccDebito/edit-debito', {result_debito, result_cliente, result_comprobante, layout:'mainlayout'});
            });
        });
    }); 
}


function cccDebitoEdit(req, res){
    const {fecha, monto, id_cliente, id_movicc_tipo_comprobante, nro_comprob, observaciones} = req.body;
    let id = req.params.id;

    console.log("fecha: "+fecha);
    console.log("monto: "+monto);
    console.log("id_cliente: "+id_cliente);
    console.log("id_movicc_tipo_comprobante: "+id_movicc_tipo_comprobante);
    console.log("nro_comprob: "+nro_comprob); 
    console.log("observaciones: "+observaciones);
    console.log("ID Usuario: "+req.user.id);

    sql = "UPDATE movicc SET fecha = '"+fecha+"', monto = '-"+monto+"', id_cliente = '"+id_cliente+"', id_movicc_tipo_comprobante = '"+id_movicc_tipo_comprobante+"', nro_comprobante = '"+nro_comprob+"', observaciones = '"+observaciones+"', id_usuario = '"+req.user.id+"' WHERE id_movicc = "+id;
    
    conex.query(sql, function(error, resultado, fields){
        if (error) {
            console.log("Ha ocurrido un error en la consulta", error.message);
            return res.status(404).send("Ha ocurrido un error en la consulta");
        }
        req.flash('success_msg', 'Obligacion de Pago Cliente Actualizada');
        res.redirect('/cccDebito');
    });
}

function cccDebitoDelete(req, res){
    let id = req.params.id;
    sql = "UPDATE movicc SET baja = DATE_FORMAT(NOW( ) , '%Y-%m-%d') WHERE id_movicc = "+id;
    conex.query(sql, function(error, resultado, fields){
        if (error) {
            console.log("Ha ocurrido un error en la consulta", error.message);
            return res.status(404).send("Ha ocurrido un error en la consulta");
        }
        req.flash('success_msg', 'Debito de Cta Cte Cliente Eliminado Exitosamente');
        res.redirect('/cccDebito');
    });
}


 module.exports = {
    getCccDebitos,
    cccDebitoRender,
    newCccDebito,
    cccDebitoEditRender,
    cccDebitoEdit,
    cccDebitoDelete
}