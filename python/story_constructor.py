import strings as sref

def story_to_dict(story):
    return {
        sref.AGE_GROUP_SECTION: parse_age_group(story),
        sref.CHAPTERS_SECTION: parse_chapters(story),
        sref.COMMENTS_SECTION: parse_comments(story),
        sref.LIKES_SECTION: parse_likes(story),
        sref.RELATIONSHIPS_SECTION: parse_relationships(story),
        sref.TAGS_SECTION: parse_tags(story),
        sref.VIEWS_SECTION: parse_views(story),
        sref.WARNINGS_SECTION: parse_warnings(story),
        sref.WORDS_SECTION: parse_word_count(story),
        sref.WORK_STATUS_SECTION: parse_work_status(story)
    }

def parse_age_group(story):
    age_group_html = story.find('span', attrs={"class", sref.AGE_GROUP_SECTION})
    return age_group_html.find('span', recursive=False).text

def parse_chapters(story):
    chapters_container_html = story.find('dd', attrs={"class", sref.CHAPTERS_SECTION})
    chapters_html = chapters_container_html.find('a', recursive=False)

    if (chapters_html):
        return int(chapters_html.text)
    return 1

def parse_comments(story):
    comments_html = story.find('dd', attrs={"class", sref.COMMENTS_SECTION})

    if comments_html:
        return int(comments_html.find('a', recursive=False).text)
    return 0

def parse_likes(story):
    likes_html = story.find('dd', attrs={"class", sref.LIKES_SECTION}) 
    
    if likes_html:
        return int(likes_html.find('a', recursive=False).text)
    return 0

def parse_relationships(story):
    relationships_html = story.find('span', attrs={"class", sref.RELATIONSHIPS_SECTION})
    return relationships_html.find('span', recursive=False).text.split(', ')


def parse_tags(story):
    tags = []
    
    for tag in story.find_all('a', attrs={"class": sref.TAGS_SECTION}):
        tags += tag
    return tags

def parse_views(story):
    return int(story.find('dd', attrs={"class", sref.VIEWS_SECTION}).text)

def parse_warnings(story):
    warnings_html = story.find('span', attrs={"class", sref.WARNINGS_SECTION})
    return warnings_html.find('span', recursive=False).text.split(', ')

def parse_word_count(story):
    wordCount = story.find('dd', attrs={"class", sref.WORDS_SECTION}).text.replace(',', '')

    if (wordCount == ''):
        return 0
    else:
        return int(wordCount)

def parse_work_status(story):
    work_status_html = story.find('span', attrs={"class", sref.WORK_STATUS_SECTION})
    return work_status_html.find('span', recursive=False).text