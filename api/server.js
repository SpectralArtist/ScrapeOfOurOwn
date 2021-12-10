const express = require("express");
const cors = require("cors");

const app = express();

var corsOptions = {
    origin: "http://localhost:3000"
};

app.use(cors(corsOptions));

app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

const db = require("./app/models");
// db.sequelize.sync();
// db.sequelize.sync({force: true});

app.get("/", (req, res) => {
    res.json({message: "Welcome to the scrape of our own website!"});
});

require("./app/routes/author.routes")(app);
require("./app/routes/story.routes")(app);
require("./app/routes/tag.routes")(app);
require("./app/routes/webscraper.routes")(app);
require("./app/routes/scrapeset.routes")(app);

const PORTNUM = process.env.PORT || 8080;
app.listen(PORTNUM, () => {
    console.log(`Server is running on port ${PORTNUM}.`);
});