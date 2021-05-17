import json
import os
from collections import Counter
from references import strings as sref

def start_by_chapter_statistics(query_folder):
    read_file = open(os.path.join(query_folder, sref.WEBSCRAPED_DATA_FILE_NAME), "r")

    json_array = json.load(read_file)

    for section in sref.BY_CHAPTER_SECTIONS:
        counter = count_group(section, json_array)
        write_by_chapter_data(query_folder, section, counter)

def count_group(section, json_array):

    counter = {}

    for story in json_array:
        chapter_count = str(story[sref.CHAPTERS_SECTION])
        groups = story[section]

        if isinstance(groups, str):
            groups = [groups]

        for group in groups:
            if group not in counter:
                counter[group] = {
                        chapter_count: {
                                sref.STORY_COUNT_SECTION: 1,
                                sref.VIEWS_SECTION: story[sref.VIEWS_SECTION]
                        }
                }

            elif chapter_count not in counter[group]:
                counter[group][chapter_count] = {
                                        sref.STORY_COUNT_SECTION: 1,
                                        sref.VIEWS_SECTION: story[sref.VIEWS_SECTION]
                                    }

            else:
                counter[group][chapter_count][sref.STORY_COUNT_SECTION] += 1
                counter[group][chapter_count][sref.VIEWS_SECTION] += story[sref.VIEWS_SECTION]

    return counter

def write_by_chapter_data(query_folder, section, counter):
    by_chapter_folder = os.path.join(query_folder, sref.BY_CHAPTER_FOLDER_NAME)

    if not os.path.exists(by_chapter_folder):
        os.mkdir(by_chapter_folder)

    section_folder = os.path.join(by_chapter_folder, section)

    if not os.path.exists(section_folder):
        os.mkdir(section_folder)

    for group, chapter_set in counter.items():
        with open(os.path.join(section_folder, group.replace("/", "") + ".txt"), 'w') as outfile:

            for chapter, counts in sorted(chapter_set.items(), key=lambda x: int(x[0]), reverse=False):
                stories = counts[sref.STORY_COUNT_SECTION]
                views = counts[sref.VIEWS_SECTION]

                outfile.write("Number of Chapters: " + chapter
                              + " Total Stories: " + str(stories)
                              + " Total Views: " + str(views)
                              + " Average Views per Story: " + str(views / stories)
                              + "\n")