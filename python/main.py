import os
import folder_setup
import storyanalyzer

base_path = os.path.join(os.path.dirname(__file__), "..")

query_folder = folder_setup.query_name_setup(base_path)

print(query_folder)

link = input("Please enter the link to be mined: ")
name = "All Stories"

all_stories = storyanalyzer.StoryAnalyzer("All Stories", query_folder)
all_stories.scrape(link)
all_stories.run_all()