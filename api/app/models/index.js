const dbConfig = require("../config/db.config");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorAliases: false,

    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.authors = require("./author.model")(sequelize, Sequelize);
db.stories = require("./story.model")(sequelize, Sequelize);
db.webscrapers = require("./webscraper.model")(sequelize, Sequelize);
db.scrapesets = require("./scrapeset.model")(sequelize, Sequelize);
db.tags = require("./tag.model")(sequelize, Sequelize);

db.webscrapers.hasMany(db.scrapesets, { foreignKey: 'webscraperId'});
db.scrapesets.belongsTo(db.webscrapers);

db.scrapesets.hasMany(db.stories, { foreignKey: 'scrapesetId'});
db.stories.belongsTo(db.scrapesets);

db.stories.hasMany(db.tags, { foreignKey: 'storyId'});
db.tags.belongsTo(db.stories);

db.authors.hasMany(db.stories, { 
    foreignKey: { 
        name: 'authorId',
        allowNull: true
    }
});
db.stories.belongsTo(db.authors);

module.exports = db;