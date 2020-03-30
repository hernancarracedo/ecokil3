var mysql = require('mysql');
var dbconfig = require('../config/database');
var conex = mysql.createConnection(dbconfig.connection);

conex.query('USE ' + dbconfig.database);


//Get todos los movimientos cuenta corriente clientes
function getMoviscc(req, res){
    sql = `SELECT CLI.id_cliente, CLI.tx_cliente, IFNULL(CC.CRED, 0) as credito
    FROM (SELECT id_cliente, SUM(monto) as CRED FROM movicc where (monto > 0) GROUP BY id_cliente) AS CC
    RIGHT JOIN (SELECT * FROM cliente) as CLI ON CLI.id_cliente = CC.id_cliente
    ORDER BY CLI.id_cliente ASC`;
    conex.query(sql, function(error, result_creditos, fields){
    if (error) {
        //console.log("Ha ocurrido un error en la consulta", error.message);
        return res.status(404).send("Ha ocurrido un error en la consulta");
    }
        sql = `SELECT CLI.id_cliente, CLI.tx_cliente, IFNULL(CC.DEBIT, 0) as debito
        FROM (SELECT id_cliente, SUM(monto) as DEBIT FROM movicc where (monto < 0) GROUP BY id_cliente) AS CC
        RIGHT JOIN (SELECT * FROM cliente) as CLI ON CLI.id_cliente = CC.id_cliente
        ORDER BY CLI.id_cliente ASC`;
        conex.query(sql, function(error, result_debitos, fields){
            if (error) {
                console.log("Ha ocurrido un error en la consulta", error.message);
                return res.status(404).send("Ha ocurrido un error en la consulta");
            }
            sql = `SELECT CLI.id_cliente, CLI.tx_cliente, IFNULL(CC.SALD, 0) as saldo
            FROM (SELECT id_cliente, SUM(monto) as SALD FROM movicc GROUP BY id_cliente) AS CC
            RIGHT JOIN (SELECT * FROM cliente) as CLI ON CLI.id_cliente = CC.id_cliente
            ORDER BY CLI.id_cliente ASC`;
            conex.query(sql, function(error, result_saldos, fields){
                if (error) {
                    console.log("Ha ocurrido un error en la consulta", error.message);
                    return res.status(404).send("Ha ocurrido un error en la consulta");
                }
                var jsonArr = [];

                for (var i = 0; i < result_saldos.length; i++) {
                    jsonArr.push({
                        id_cliente: result_debitos[i].id_cliente,
                        tx_cliente: result_debitos[i].tx_cliente,
                        debitos: result_debitos[i].debito,
                        creditos: result_creditos[i].credito,
                        saldo:result_saldos[i].saldo
                    });
                }
                var response = jsonArr;
                res.render('movicc/all-movicc', {response, layout: 'mainlayout'});
            }); 
        });
    });
}

/*

//Render Formulario de alta de DEBITO (o deuda nueva de un cliente)
async function moviccRender(req, res){
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
  
            res.render('movicc/new-debito', {result_comprobante, result_cliente, layout:'mainlayout'});
        });
    });
}


//Render Formulario de alta de CREDITO (o pago nuevo de un cliente)
async function moviccCreditoRender(req, res){
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
            sql = "SELECT id_movicc_formapago, tx_movicc_formapago FROM `movicc_formapago` WHERE baja is null";
            conex.query(sql, function(error, result_formapago, fields){
                if (error) {
                    console.log("Ha ocurrido un error en la consulta", error.message);
                    return res.status(404).send("Ha ocurrido un error en la consulta");
                }
  
                res.render('movicc/new-credito', {result_cliente, result_comprobante, result_formapago, layout:'mainlayout'});
            });
        });
  
    });
}
  
//Post Movimiento de DEBITO en cuenta corriente cliente (nueva deuda)
async function newMoviccDebito(req, res){
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
      sql = "INSERT INTO movicc (`fecha`, `monto`, `id_cliente`, `id_movicc_tipo_comprobante`, `nro_comprobante`, `observaciones`, `id_usuario`) VALUES ('" + fecha + "', '" + monto + "', '" + id_cliente + "', '"+id_movicc_tipo_comprobante+"', '"+nro_comprob+"', '"+observaciones+"', '"+req.user.id+"')";
      console.log ("asi queda consulta:\n" + sql);
      conex.query(sql, function(error, resultado, fields){
          if (error) {
              console.log("Ha ocurrido un error en la consulta", error.message);
              return res.status(404).send("Ha ocurrido un error en la consulta");
          }
          req.flash('success_msg', 'Nuevo Debito en Cuenta Corriente de Cliente Agregado');
          res.redirect('/movicc');
      });
  }
}

//Post Movimiento de CREDITO en cuenta corriente cliente (nuevo pago)
async function newMoviccCredito(req, res){
    const {fecha, monto, id_cliente, id_movicc_tipo_comprobante, nro_comprob, id_movicc_formapago, observaciones} = req.body;
    const errors = [];
    if (!fecha) { errors.push({text: 'Ingrese fecha del Pago.'}); }
    if (!monto) { errors.push({text: 'Ingrese el monto del Pago.'}); }    
    if (!id_cliente) { errors.push({text: 'Ingrese el cliente al que corresponde el pago.'}); }
    if (!id_movicc_tipo_comprobante) { errors.push({text: 'Ingrese el tipo de comprobante.'}); }   
    if (!id_movicc_formapago) { errors.push({text: 'Ingrese forma de pago.'}); }       
    if (!observaciones) { errors.push({text: 'Ingrese alguna observacion sobre el pago.'}); }    
  
    console.log("fecha: "+fecha);
    console.log("monto: "+monto);
    console.log("id_cliente: "+id_cliente);
    console.log("id_movicc_tipo_comprobante: "+id_movicc_tipo_comprobante);
    console.log("nro_comprob: "+nro_comprob); 
    console.log("id_movicc_formapago: "+id_movicc_formapago);     
    console.log("observaciones: "+observaciones);
    console.log("ID Usuario: "+req.user.id);
    
     
    if (errors.length > 0) {
        res.render('movicc/new-credito', {
        errors,
        fecha, 
        monto,
        id_cliente, 
        id_movicc_tipo_comprobante, 
        nro_comprob, 
        id_movicc_formapago,     
        observaciones,
        layout: 'mainlayout'
        });
    } else {
        sql = "INSERT INTO movicc  (`fecha`, `monto`, `id_cliente`, `id_movicc_tipo_comprobante`, `nro_comprobante`, `id_movicc_formapago`, `observaciones`, `id_usuario`) VALUES ('" + fecha + "', '" + monto + "', '" + id_cliente + "', '"+id_movicc_tipo_comprobante+"', '"+nro_comprob+"', '"+id_movicc_formapago+"', '"+observaciones+"', '"+req.user.id+"')";
        console.log ("asi queda consulta:\n" + sql);
        conex.query(sql, function(error, resultado, fields){
            if (error) {
                console.log("Ha ocurrido un error en la consulta", error.message);
                return res.status(404).send("Ha ocurrido un error en la consulta");
            }
            req.flash('success_msg', 'Nuevo Debito en Cuenta Corriente de Cliente Agregado');
            res.redirect('/movicc');
        });
    }
  }


/*
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

*/

 module.exports = {
    getMoviscc,
    //moviccRender
    //moviccDebitoRender,
    //moviccCreditoRender,
    //newMoviccDebito,
    //newMoviccCredito,
    //movibancoEditRender,
    //movibancoEdit,
    //movibancoDelete
}