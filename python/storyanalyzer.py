import json
import os
import csv
import webscraper
import folder_setup
from collections import Counter
import strings as sref

class StoryAnalyzer(webscraper.Webscraper):

    def __init__(self, name, folder_path):
        super().__init__(name, folder_path)

    def scrape(self, link):
        super().scrape(link)
        self._calc_gen_stats()

    def set_stories(self, stories: list[dict], link: str=None):
        if link:
            self._set_link(link)
        else:
            self.link = link

        with open(self.get_datafile_path(), 'w') as outfile:
            json.dump(stories, outfile)

        self._calc_gen_stats()

    def get_stories(self):
        return json.load(open(self.get_datafile_path(), 'r'))
        
    def _calc_gen_stats(self):
        data = json.load(open(self.get_datafile_path(), 'r'))

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

    def write_gen_stats_readable(self):
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

    def write_gen_stats_csv(self):
        with open(self.get_gen_stats_csv_file_path(), 'w') as csv_outfile:
            csv_writer = csv.writer(csv_outfile, delimiter=',')

            csv_writer.writerows([
                    # Totals Sections
                    ["Total Stories", str(self.sum_stories)],
                    ["Total Chapters", str(self.sum_chapters)],
                    ["Total Words", str(self.sum_words)],
                    ["Total Views", str(self.sum_views)],
                    ["Total Likes" + str(self.sum_likes)],
                    ["Total Comments", str(self.sum_comments)],

                    # Per Story Averages Section
                    ["Avg. Chapters per Story", str(round(self.sum_chapters / self.sum_stories, 2))],
                    ["Avg. Words per Story", str(int(self.sum_words / self.sum_stories))],
                    ["Avg. Likes per Story", str(int(self.sum_likes / self.sum_stories))],
                    ["Avg. Comments per Story", str(int(self.sum_comments / self.sum_stories))],

                    # Per Chapter Averages Section
                    ["Avg. Words per Chapter", str(int(self.sum_words / self.sum_chapters))]

            ])
    
    def get_gen_stats_csv_file_path(self):
        return os.path.join(self.folder_path, self.name + " General Statistics.csv")

    def write_tag_counts_readable(self):
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

    def write_tag_counts_csv(self, ranked=False):
        with open(self.get_tag_counts_csv_file_path(), 'w') as csv_outfile:

            csv_writer = csv.writer(csv_outfile, delimiter=',')

            if ranked:
                csv_writer.writerow(["Rank", "Tag", "Times Used"])
            else:
                csv_writer.writerow(["Tag", "Times Used"])

            index = 1

            for tag, total in self.tags_counter.most_common():
                if ranked:
                    csv_writer.writerow([str(index), tag, str(total)])
                    index += 1
                else:
                    csv_writer.writerow([tag, str(total)])


    def get_tag_counts_csv_file_path(self):
        return os.path.join(self.folder_path, self.name + " Tag Counts.csv")

    def count_by_chapter(self):
        data = json.load(open(self.get_datafile_path(), 'r'))
        counter = {}

        for story in data:
            chapter = story[sref.CHAPTERS_SECTION]
            views = story[sref.VIEWS_SECTION]
            comments = story[sref.COMMENTS_SECTION]
            likes = story[sref.LIKES_SECTION]
            words = story[sref.WORDS_SECTION]

            if chapter not in counter:
                counter[chapter] = {
                        sref.VIEWS_SECTION: views,
                        sref.COMMENTS_SECTION: comments,
                        sref.LIKES_SECTION: likes,
                        sref.WORDS_SECTION: words,
                        sref.STORY_COUNT_SECTION: 1
                }
            else:
                counter[chapter][sref.VIEWS_SECTION] += views
                counter[chapter][sref.COMMENTS_SECTION] += comments
                counter[chapter][sref.LIKES_SECTION] += likes
                counter[chapter][sref.WORDS_SECTION] += words
                counter[chapter][sref.STORY_COUNT_SECTION] += 1     
        
        json.dump(counter, open(self.get_by_chapter_datafile_path(), 'w'))

    def get_by_chapter_datafile_path(self):
        return os.path.join(self.folder_path, self.name + " By Chapter.json")

    def write_by_chapter_readable(self):
        if not os.path.exists(self.get_by_chapter_datafile_path()): return

        data = json.load(open(self.get_by_chapter_datafile_path(), 'r'))
        
        with open(self.get_by_chapter_file_path(), 'w') as outfile:
            for chapter, counts in sorted(data.items(), key=lambda x: int(x[0]), reverse=False):
                stories = counts[sref.STORY_COUNT_SECTION]
                views = counts[sref.VIEWS_SECTION]

                outfile.write("Number of Chapters: " + chapter
                            + " Total Stories: " + str(stories)
                            + " Total Views: " + str(views)
                            + " Average Views per Story: " + str(views / stories)
                            + "\n")

    def get_by_chapter_file_path(self):
        return os.path.join(self.folder_path, self.name + " By Chapter.txt")

    def write_by_chapter_csv(self):
        if not os.path.exists(self.get_by_chapter_datafile_path()): return
        data = json.load(open(self.get_by_chapter_datafile_path(), 'r'))
            
        with open(self.get_by_chapter_csv_file_path(), 'w') as csv_outfile:

            csv_writer = csv.writer(csv_outfile, delimiter=',')
            csv_writer.writerow(["Number of Chapters", "Total Stories", "Total Views", "Average Views per Story"])

            for chapter, counts in sorted(data.items(), key=lambda x: int(x[0]), reverse=False):
                stories = counts[sref.STORY_COUNT_SECTION]
                views = counts[sref.VIEWS_SECTION]

                csv_writer.writerow([chapter, str(stories), str(views), str(views / stories)])

    def get_by_chapter_csv_file_path(self):
        return os.path.join(self.folder_path, self.name + " By Chapter.csv")

    def run_all(self):
        self.write_gen_stats_readable()
        self.write_gen_stats_csv()
        self.write_tag_counts_readable()
        self.write_tag_counts_csv()
        self.count_by_chapter()
        self.write_by_chapter_readable()
        self.write_by_chapter_csv()


def split_storyanalyzer(analyzer: StoryAnalyzer, 
                        section: str, 
                        folder_path: str=None) -> list[StoryAnalyzer]:
    if section not in sref.BY_CHAPTER_SECTIONS: return
    
    storyanalyzer_list: list[StoryAnalyzer] = []
    split_groups: dict[str, list[dict]] = {}
    stories: list[dict] = analyzer.get_stories()
    if not folder_path:
        folder_path = analyzer.folder_path


    for story in stories:
        groups = []
        if not isinstance(story[section], list):
            groups.append(story[section])
        else:
            groups = story[section]

        for group in groups:
            if group in split_groups:
                split_groups[group].append(story)
            else:
                split_groups[group] = [story]

    for group_key, story_list in split_groups.items():
        sub_folder_path = folder_setup.create_sub_folder(folder_path, group_key)
        temp_analyzer = StoryAnalyzer(group_key, sub_folder_path)
        temp_analyzer.set_stories(story_list)
        storyanalyzer_list.append(temp_analyzer)

    return storyanalyzer_list