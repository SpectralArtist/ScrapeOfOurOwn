const { sequelize } = require("../models");
const db = require("../models");

exports.getAllCounts = (req, res) => {
    const search = req.query.search ? req.query.search : '';
    sequelize.query(`SELECT tag, type, COUNT(*) AS numStories FROM stories INNER JOIN tags ON stories.id = tags.storyId, (SELECT stories.id, MAX(createdAt) AS created_date FROM stories GROUP BY id) most_recent WHERE stories.id = most_recent.id AND stories.createdAt = most_recent.created_date AND tag LIKE '%${search}%' GROUP BY tag, type ORDER BY numStories DESC, tag`, 
                    { type: sequelize.QueryTypes.SELECT })
    .then(tags => {
        res.send(tags);
    })
    .catch(err => {
        res.status(500).send({
            message: err.message || "Crashed in Tags LOL"
        });
    });
};

exports.getPercentTypes = (req, res) => {
    sequelize.query(`SELECT type, (COUNT(type)/(SELECT COUNT(*) FROM tags) * 100) AS percent FROM tags GROUP BY type`,
    { type: sequelize.QueryTypes.SELECT })
    .then(counts => {
        counts.forEach(count => {
            count.percent = parseFloat(count.percent);
        });
        res.send(counts);
    })
    .catch(err => {
        res.status(500).send({
            message: err.message || "Crashed in Tag Counts LOL"
        });
    });
}