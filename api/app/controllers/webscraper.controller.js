const db = require("../models");
const Webscraper = db.webscrapers;
const Op = db.Sequelize.Op;

exports.getAll = (req, res) => {
    Webscraper.findAll()
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message: err.message || "Crashed in Webscrapers LOL"
        });
    });
};

exports.create = (req, res) => {
    const webscraper = {
        name: req.body.name,
        link: req.body.link,
        public: req.body.public
    };

    Webscraper.create(webscraper)
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message: err.message || "An error occured while creating a Webscraper."
        });
    });
}

exports.delete = (req, res) => {
    const id = parseInt(req.params.id);
    Webscraper.destroy({
        where: { id: id }
    })
    .then(data => {
        res.status(200).send("Deleted.");
    })
    .catch(err => {
        res.status(500).send({
            message: err.message || `An error occured while deleting Webscraper ${name}.`
        });
    });
}