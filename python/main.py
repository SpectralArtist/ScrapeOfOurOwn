import os

from .webscraper import folder_setup
from .webscraper import webscraper


# from webscraper import webscraper
# from stats import general_data
# from stats import by_chapter_data

base_path = os.path.join(os.path.dirname(__file__), "..")

query_folder = folder_setup.query_name_setup(base_path)

print(query_folder)

link = input("Please enter the link to be mined: ")

all_stories = webscraper.Webscraper("All Stories", query_folder)
all_stories.scrape(link)

# general_data.start_general_statistics(query_folder)

# by_chapter_data.start_by_chapter_statistics(query_folder)