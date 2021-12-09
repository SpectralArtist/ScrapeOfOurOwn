module.exports = (sequelize, Sequelize) => {
    const Story = sequelize.define("story", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        scrapesetId: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        title: {
            type: Sequelize.STRING
        },
        publish: {
            type: Sequelize.STRING
        },
        language: {
            type: Sequelize.STRING
        },
        words: {
            type: Sequelize.INTEGER
        },
        comments: {
            type: Sequelize.INTEGER
        },
        views: {
            type: Sequelize.INTEGER
        },
        likes: {
            type: Sequelize.INTEGER
        },
        collections: {
            type: Sequelize.INTEGER
        },
        chapters: {
            type: Sequelize.INTEGER
        },
        series: {
            type: Sequelize.BOOLEAN
        },
        complete: {
            type: Sequelize.BOOLEAN
        }
    });

    return Story;
}