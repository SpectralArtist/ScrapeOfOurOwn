module.exports = (sequelize, Sequelize) => {
    const Webscraper = sequelize.define("webscraper", {
        name: {
            type: Sequelize.STRING
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