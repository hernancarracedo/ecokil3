function profileRender(req, res) {
    res.render('perfil/profile.ejs', {
        user : req.user // get the user out of session and pass to template
    });
};

module.exports = {
    profileRender
}