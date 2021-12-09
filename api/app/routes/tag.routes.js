module.exports = app => {
    const stories = require("../controllers/tag.controller");
    var router = require("express").Router();

    router.get('/', stories.getAllCounts);
    router.get('/type', stories.getPercentTypes);

    app.use('/api/tags', router);
}