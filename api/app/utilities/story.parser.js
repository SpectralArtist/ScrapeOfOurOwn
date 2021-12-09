module.exports = function constructStory(content, authorId) {
    const story = {
        id: parseStoryID(content),
        authorId: authorId,
        author: {
            id: authorId,
            name: parseAuthor(content)
        },
        title: parseTitle(content),
        publish: parsePublishDate(content),
        language: parseLanguage(content),
        words: parseWords(content),
        comments: parseComments(content),
        views: parseViews(content),
        likes: parseLikes(content),
        collections: parseCollections(content),
        chapters: parseChapters(content),
        series: parseSeries(content),
        tags: parseTags(content),
        complete: parseWorkInProgress(content)
    }

    return story;
}

function parseStoryID(content) {
    return parseInt(content('h4 a:first-child')['0']['attribs']['href'].substring(7));
}

function parseTitle(content) {
    return content('h4 a:first-child').text();
}

function parseAuthor(content) {
    return content('h4 a[rel=author]').text();
}

function parsePublishDate(content) {
    return content('.datetime').text();
}

function parseLanguage(content) {
    return content('dd.language').text();
}

function parseWords(content) {
    const words = content('dd.words').text().replace(',', '');
    return parseInt(words);
}

function parseComments(content) {
    const comments = content('dd.comments a').text();
    return (comments.length == 0 ? 0 : parseInt(comments));
}

function parseViews(content) {
    const views = content('dd.hits').text();
    return parseInt(views);
}

function parseLikes(content) {
    const likes = content('dd.kudos').text();
    return (likes && parseInt(likes) > 0 ? likes : 0);
}

function parseCollections(content) {
    const collections = content('dd.collections a').text();
    return (collections.length == 0 ? 0 : parseInt(collections));
}

function parseChapters(content) {
    const chapters = content('dd.chapters a').text();
    return (chapters.length == 0 ? 1 : parseInt(chapters));
}

function parseSeries(content) {
    const series = content('ul.series').text();
    return (series ? true : false);
}

function parseTags(content) {
    const fandomTags = parseFandomTags(content);
    const freeformTags = parseFreeformTags(content);
    const characterTags = parseCharacterTags(content);
    const ratingTag = parseRatingTag(content);
    const warningTags = parseWarningTags(content);
    const relationshipTags = parseRelationshipTags(content);

    return fandomTags.concat(freeformTags, characterTags, ratingTag, warningTags, relationshipTags);
}

function parseFandomTags(content) {
    const htmlTags = content('h5.fandoms a');
    const fandomTags = [];
    for (var i = 0; i < htmlTags.length; i++) {
        fandomTags.push({type: "fandom", tag: htmlTags[i]["children"][0]["data"]});
    }
    return fandomTags;
}

function parseFreeformTags(content) {
    const htmlTags = content('li.freeforms a');
    const freeformTags = [];
    for (var i = 0; i < htmlTags.length; i++) {
        freeformTags.push({type: "freeform", tag: htmlTags[i]["children"][0]["data"]});
    }
    return freeformTags;
}

function parseCharacterTags(content) {
    const htmlTags = content('li.characters a');
    const characterTags = [];
    for (var i = 0; i < htmlTags.length; i++) {
        characterTags.push({type: "character", tag: htmlTags[i]["children"][0]["data"]});
    }
    return characterTags;
}

function parseWarningTags(content) {
    return content('span.warnings span').text().split(', ').map(tag => {
        return {type: "warning", tag: tag};
    });
}

function parseRelationshipTags(content) {
    return content('span.category span').text().split(', ').map(tag => {
        return {type: "relationship", tag: tag};
    });
}

function parseWorkInProgress(content) {
    const iswip = content('span.iswip span').text();
    return (iswip == "Complete Work");
}

function parseRatingTag(content) {
    return {type: "rating", tag: content('span.rating span').text()};
}