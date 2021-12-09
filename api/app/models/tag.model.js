module.exports = (sequelize, Sequelize) => {
    const Tag = sequelize.define("tag", {
        storyId: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        type: {
            type: Sequelize.STRING,
            primaryKey: true
        },
        tag: {
            type: Sequelize.STRING,
            primaryKey: true
        }
    });

    return Tag;
}