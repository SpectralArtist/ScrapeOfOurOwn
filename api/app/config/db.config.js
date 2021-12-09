module.exports = {
    HOST: "localhost",
    USER: "root",
    PASSWORD: "Potato2000",
    DB: "scrapeofourown",
    dialect: "mysql",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
}