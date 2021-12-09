const { sequelize } = require("../models");
const db = require("../models");
const Story = db.stories;
const Op = db.Sequelize.Op;

exports.getAll = (req, res) => {
    const search = req.query.search ? req.query.search : '';
    sequelize.query(`SELECT stories.id, 
                            title, 
                            words, 
                            comments, 
                            views, 
                            likes, 
                            chapters, 
                            complete, 
                            authorId, 
                            GROUP_CONCAT(tags.tag) AS tags 
                            FROM stories 
                            INNER JOIN tags ON stories.id = tags.storyId, 
                            (SELECT stories.id, MAX(createdAt) AS created_date FROM stories GROUP BY id) most_recent 
                            WHERE stories.id = most_recent.id AND stories.createdAt = most_recent.created_date AND stories.title LIKE '%${search}%' 
                            GROUP BY stories.id, title, words, comments, views, likes, chapters, complete, authorId`, 
                    { type: sequelize.QueryTypes.SELECT })
    .then(stories => {
        stories.forEach(story => {
            story.tags.split(',');
        });
        res.send(stories);
    })
    .catch(err => {
        res.status(500).send({
            message: err.message || "Crashed in Stories LOL"
        });
    });
};

exports.getStoryTotals = (req, res) => {
    sequelize.query(`SELECT COUNT(*) AS totalStories, 
                            SUM(words) AS totalWords, 
                            SUM(comments) AS totalComments, 
                            SUM(views) AS totalViews, 
                            SUM(likes) AS totalLikes, 
                            SUM(chapters) AS totalChapters, 
                            AVG(words) AS averageWords, 
                            AVG(comments) AS averageComments, 
                            AVG(views) AS averageViews, 
                            AVG(likes) AS averageLikes, 
                            AVG(chapters) AS averageChapters 
                            FROM stories, 
                            (SELECT stories.id, MAX(createdAt) AS created_date FROM stories GROUP BY id) most_recent 
                            WHERE stories.id = most_recent.id AND stories.createdAt = most_recent.created_date`, 
                    { type: sequelize.QueryTypes.SELECT })
    .then(totals => {
        totals.totalChapters = parseFloat(totals.totalChapters);
        totals.totalWords = parseFloat(totals.totalWords);
        totals.totalComments = parseFloat(totals.totalComments);
        totals.totalViews = parseFloat(totals.totalViews);
        totals.totalLikes = parseFloat(totals.totalLikes);
        totals.averageChapters = parseFloat(totals.averageChapters);
        totals.averageWords = parseFloat(totals.averageWords);
        totals.averageComments = parseFloat(totals.averageComments);
        totals.averageViews = parseFloat(totals.averageViews);
        totals.averageLikes = parseFloat(totals.averageLikes);

        res.send(totals);
    })
    .catch(err => {
        res.status(500).send({
            message: err.message || "Crashed in Stories LOL"
        });
    });
}

exports.getCompletedStats = (req, res) => {
    let xaxis = req.query.xaxis;
    let yaxis = req.query.yaxis;
    console.log(xaxis);
    console.log(yaxis);

    if (!xaxis) {
        xaxis = "chapters"
    }
    if (!yaxis) {
        yaxis = "views"
    }

    sequelize.query(`SELECT ${xaxis}, 
                            ${yaxis}, 
                            complete, 
                            COUNT(*) AS numSame 
                            FROM stories, 
                            (SELECT stories.id, MAX(createdAt) AS created_date FROM stories GROUP BY id) most_recent 
                            WHERE stories.id = most_recent.id AND stories.createdAt = most_recent.created_date 
                            GROUP BY ${xaxis}, ${yaxis}, complete 
                            ORDER BY ${xaxis} ASC, ${yaxis} ASC, complete ASC`, 
                    { type: sequelize.QueryTypes.SELECT })
    .then(stories => {
        res.send(stories);
    })
    .catch(err => {
        res.status(500).send({
            message: err.message || "Crashed in Stories LOL"
        });
    });
}