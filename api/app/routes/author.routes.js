module.exports = app => {
    const authors = require("../controllers/author.controller");
    var router = require("express").Router();

    router.get('/', authors.getAll);

    router.post('/', authors.create);

    app.use('/api/authors', router);
}