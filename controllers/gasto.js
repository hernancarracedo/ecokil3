const Eso = require('../models/eso');


//Get todos las conexiones
async function getEsos(req, res){
  const esos = await Eso.find();
  res.render('eso/all-eso', { esos, layout:'mainlayout' });
}


//Render Formulario conexiones
function esoRender(req, res){
  res.render('eso/new-eso', {
    layout: 'mainlayout'
  });
} 
/*
//Post conexiones
async function newEso(req, res){
   const { deliveryTicket } = req.body;
   const errors = [];
  if (!deliveryTicket) {
    errors.push({text: 'Ingrese el Delivery Ticket de la ESO'});
  }
  if (errors.length > 0) {
    res.render('eso/new-eso', {
      errors,
      eso
    });
  } else {
    const newEso = new Eso({deliveryTicket});
    await newEso.save();
    req.flash('success_msg', 'Nueva ESO Agregada');
    res.redirect('/eso');
  }
}



async function esoEditRender(req, res){
  const eso = await Eso.findById(req.params.id);
  res.render('eso/edit-eso', { eso, layout:'mainlayout' });
}


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
    getEsos,
    esoRender,
   // newEso,
   // esoEditRender,
   // esoEdit,
   // esoDelete
   
}
