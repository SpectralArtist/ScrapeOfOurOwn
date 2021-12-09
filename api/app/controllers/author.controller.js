const { sequelize } = require("../models");
const db = require("../models");
const Author = db.authors;
const Op = db.Sequelize.Op;

exports.getAll = (req, res) => {
    let search = req.query.search ? req.query.search : '';
    sequelize.query(`SELECT * FROM authors WHERE name LIKE '%${search}%'`, { type: sequelize.QueryTypes.SELECT })
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message: err.message || "Crashed in Authors LOL"
        });
    });
};

exports.create = (req, res) => {
    const author = {
        archiveId: req.body.archiveId,
        name: req.body.name
    };

    Author.create(author)
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message: err.message || "An error occured while creating an Author."
        });
    });
}