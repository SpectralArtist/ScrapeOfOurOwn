import json
import os
from collections import Counter
from references import strings as sref

def start_general_statistics(query_folder):
    read_file = open(os.path.join(query_folder, sref.WEBSCRAPED_DATA_FILE_NAME), "r")

    json_array = json.load(read_file)

    stats, tags_counter = calculate_general_statistics(json_array)

    stats_folder = os.path.join(query_folder, sref.GENERAL_STATS_FOLDER_NAME)
    os.mkdir(stats_folder)

    write_general_data(stats_folder, *stats)
    wrte_tag_counts(stats_folder, tags_counter)

def calculate_general_statistics(json_array):
    sum_stories = 0
    sum_chapters = 0
    sum_words = 0
    sum_views = 0
    sum_likes = 0
    sum_comments = 0
    tags_counter = Counter()

    for story in json_array:
        sum_stories += 1
        sum_chapters += story[sref.CHAPTERS_SECTION]
        sum_words += story[sref.WORDS_SECTION]
        sum_views += story[sref.VIEWS_SECTION]
        sum_likes += story[sref.LIKES_SECTION]
        sum_comments += story[sref.COMMENTS_SECTION]
        tags_counter.update(story[sref.TAGS_SECTION])

    return [(
        sum_stories,
        sum_chapters,
        sum_words,
        sum_views,
        sum_likes,
        sum_comments
    ), tags_counter]

def write_general_data(stats_folder,
                           sum_stories,
                           sum_chapters,
                           sum_words,
                           sum_views,
                           sum_likes,
                           sum_comments):

    with open(os.path.join(stats_folder, sref.GENERAL_STATS_FILE_NAME), 'w') as outfile:

        outfile.write("Number of Stories: " + str(sum_stories) + "\n")
        outfile.write("Number of Chapters: " + str(sum_chapters) + "\n")
        outfile.write("Number of Words: " + str(sum_words) + "\n")
        outfile.write("Number of Views: " + str(sum_views) + "\n")
        outfile.write("Number of Likes: " + str(sum_likes) + "\n")
        outfile.write("Number of Comments: " + str(sum_comments) + "\n")

        outfile.write("\nAverage Number of Chapters per Story: " 
                      + str(round(sum_chapters / sum_stories, 2)) + "\n")
        outfile.write("Average Number of Words per Story: " 
                      + str(int(sum_words / sum_stories)) + "\n")
        outfile.write("Average Number of Words per Chapter: " 
                      + str(int(sum_words / sum_chapters)) + "\n")
        outfile.write("\nAverage Number of Likes per Story: " 
                      + str(int(sum_likes / sum_stories)) + "\n")
        outfile.write("Average Number of Comments per Story: " 
                      + str(int(sum_comments / sum_stories)) + "\n")

def wrte_tag_counts(stats_folder, tags_counter):

    with open(os.path.join(stats_folder, sref.TAGS_COUNT_FILE_NAME), 'w') as outfile:

        index = 1

        outfile.write("This lists all the tags used within the stories and ranks them by popularity.\n\n")
        for key, value in tags_counter.most_common():
            outfile.write("Ranked: " + str(index) 
                          + ", Number of Times Used: " + str(value) 
                          + ", Tag: " + key + "\n")
            index += 1