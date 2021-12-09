module.exports = app => {
    const scrapesets = require("../controllers/scrapeset.controller");
    var router = require("express").Router();

    router.post('/', scrapesets.forceScrape);

    app.use('/api/scrapesets', router);
}