function indexRender(req, res) {
    //res.render('index/index.ejs'); // load the index.ejs file
    res.render('index/index');
};

module.exports = {
    indexRender
}