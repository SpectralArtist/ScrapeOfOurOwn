import json
import os
from python import webscraper
from collections import Counter
from references import strings as sref
from webscraper import webscraper

class StoryAnalyzer(webscraper.Webscraper):

    def __init__(self, name, folder_path):
        super().__init__(name, folder_path)

    def scrape(self, link):
        super().scrape(link)
        self._calc_gen_stats()
        
    def _calc_gen_stats(self):
        file = open(self.get_datafile_path(), 'r')
        data = json.load(file)

        self.sum_stories = 0
        self.sum_chapters = 0
        self.sum_words = 0
        self.sum_views = 0
        self.sum_likes = 0
        self.sum_comments = 0
        self.tags_counter = Counter()

        for story in data:
            self.sum_stories += 1
            self.sum_chapters += story[sref.CHAPTERS_SECTION]
            self.sum_words += story[sref.WORDS_SECTION]
            self.sum_views += story[sref.VIEWS_SECTION]
            self.sum_likes += story[sref.LIKES_SECTION]
            self.sum_comments += story[sref.COMMENTS_SECTION]
            self.tags_counter.update(story[sref.TAGS_SECTION])

    def write_gen_stats_file(self):
        with open(self.get_gen_stats_file_path(), 'w') as outfile:

            outfile.write("Number of Stories: " + str(self.sum_stories) + "\n")
            outfile.write("Number of Chapters: " + str(self.sum_chapters) + "\n")
            outfile.write("Number of Words: " + str(self.sum_words) + "\n")
            outfile.write("Number of Views: " + str(self.sum_views) + "\n")
            outfile.write("Number of Likes: " + str(self.sum_likes) + "\n")
            outfile.write("Number of Comments: " + str(self.sum_comments) + "\n")

            outfile.write("\nAverage Number of Chapters per Story: " 
                        + str(round(self.sum_chapters / self.sum_stories, 2)) + "\n")
            outfile.write("Average Number of Words per Story: " 
                        + str(int(self.sum_words / self.sum_stories)) + "\n")
            outfile.write("Average Number of Words per Chapter: " 
                        + str(int(self.sum_words / self.sum_chapters)) + "\n")
            outfile.write("\nAverage Number of Likes per Story: " 
                        + str(int(self.sum_likes / self.sum_stories)) + "\n")
            outfile.write("Average Number of Comments per Story: " 
                        + str(int(self.sum_comments / self.sum_stories)) + "\n")

    
    def get_gen_stats_file_path(self):
        return os.path.join(self.folder_path, self.name + " General Statistics.txt")

    def write_tag_counts_file(self):
        with open(self.get_tag_counts_file_path(), 'w') as outfile:

            index = 1

            outfile.write("This lists all the tags used within the stories and ranks them by popularity.\n\n")
            for key, value in self.tags_counter.most_common():
                outfile.write("Ranked: " + str(index) 
                            + ", Number of Times Used: " + str(value) 
                            + ", Tag: " + key + "\n")
                index += 1

    def get_tag_counts_file_path(self):
        return os.path.join(self.folder_path, self.name + " Tag Counts.txt")