const constructStory = require('../utilities/story.parser');
const cheerio = require('cheerio');
const { Scraper, Root, DownloadContent, OpenLinks, CollectContent } = require('nodejs-web-scraper');
const db = require("../models");
const Author = db.authors;
const Webscraper = db.webscrapers;
const ScrapeSet = db.scrapesets;
const Story = db.stories;
const Op = db.Sequelize.Op;

exports.forceScrape = async (req, res) => {
    const webscraperId = req.body.name
    const webscraper = await Webscraper.findOne({where: { name: webscraperId }});
    const link = webscraper.dataValues.link;

    const config = {
        baseSiteUrl: `https://archiveofourown.org/`,
        startUrl: link,
        concurrency: 3,
        maxRetries: 3,
        delay: 5000
    }

    const stories = [];

    const scraper = new Scraper(config);
    const root = new Root({ pagination: { queryString: 'page', begin: 1, end: 3 } });

    const work = new CollectContent('ol.work', { name: 'work', contentType: 'html', getElementContent: (content, address) => {
        const $ = cheerio.load(content);
        const works = $('li.work');
        Object.keys(works).forEach(key => {
            if(key != 'length' && key != 'options' && key != '_root' && key != 'prevObject') {
                console.log(key);
                const authorIDSection = works[key]['attribs']['class'].split(' ');
                const authorID = (authorIDSection[4] ? parseInt(authorIDSection[4].substring(5)) : null);
                stories.push(constructStory(cheerio.load(works[key]), authorID));
            }
        });
    }});

    root.addOperation(work);

    await scraper.scrape(root);

    const authorMap = new Map(stories.map(story => [`${story.author.id}`, story.author.name]));
    const authorIdArray = [... new Set(stories.map(story => {
        return story.authorId;
    }))];

    await Promise.all(authorIdArray.map(async (authorId) => {
        const author = await Author.findOne({where: { id: authorId }});
        
        console.log(authorMap);
        console.log(authorId);

        if (author === null && authorId != null) {
            console.log(authorMap.get(`${authorId}`));
            await Author.create({id: authorId, name: authorMap.get(`${authorId}`)}, {
                fields: [
                    'id',
                    'name'
                ]
            });
        }
    }));

    console.log(stories.length);

    const scrapeSet = {
        webscraperId: webscraperId,
        stories: stories
    }

    ScrapeSet.create(scrapeSet, {
        fields: [
            'webscraperId'
        ],
        include: [
            {
                model: db.stories,
                as: 'stories',
                attributes: [
                    'id',
                    'authorId',
                    'title',
                    'publish',
                    'language',
                    'words',
                    'comments',
                    'views',
                    'likes',
                    'collections',
                    'chapters',
                    'series',
                    'complete'
                ],
                include: {
                    model: db.tags,
                    as: 'tags',
                    attributes: ['type', 'tag']
                }
            }
        ]
    })
    .then(scrapeset => {
        res.status(200).send({
            message: "ScrapeSet created."
        });
    })
    .catch(err => {
        res.status(500).send({
            message: err.message || "An error occured while creating a Story."
        });
    });
}