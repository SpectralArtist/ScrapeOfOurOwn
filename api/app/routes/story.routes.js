module.exports = app => {
    const stories = require("../controllers/story.controller");
    var router = require("express").Router();

    router.get('/', stories.getAll);
    router.get('/stats/completed', stories.getCompletedStats);
    router.get('/stats/total', stories.getStoryTotals);

    app.use('/api/stories', router);
}