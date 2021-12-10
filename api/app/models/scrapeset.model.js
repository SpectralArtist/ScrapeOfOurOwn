module.exports = (sequelize, Sequelize) => {
    const ScrapeSet = sequelize.define("scrapeset", {
        webscraperId: {
            type: Sequelize.INTEGER
        }
    });

    return ScrapeSet;
}