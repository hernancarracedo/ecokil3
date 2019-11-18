function profileRender(req, res) {
    res.render('perfil/profile',
    //res.render('perfil/profile.ejs', 
    {
        user : req.user, // get the user out of session and pass to template
        layout:'mainlayout'
    });
};
/*
res.render('asset/all-asset', { 
    assets, 
    layout:'mainlayout'
     });

     */

module.exports = {
    profileRender
}