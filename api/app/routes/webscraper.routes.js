module.exports = app => {
    const webscrapers = require("../controllers/webscraper.controller");
    var router = require("express").Router();

    router.get('/', webscrapers.getAll);

    router.post('/', webscrapers.create);

    router.delete('/:id', webscrapers.delete);

    app.use('/api/webscrapers', router);
}