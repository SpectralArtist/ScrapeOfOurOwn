module.exports = (sequelize, Sequelize) => {
    const Webscraper = sequelize.define("webscraper", {
        name: {
            type: Sequelize.STRING,
            primaryKey: true
        },
        link: {
            type: Sequelize.STRING
        },
        public: {
            type: Sequelize.BOOLEAN
        }
    });

    return Webscraper;
}