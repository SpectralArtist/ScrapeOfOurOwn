import os

from webscraper import folder_setup
from webscraper import webscraper
from stats import general_data
from stats import by_chapter_data

base_path = os.path.join(os.path.dirname(__file__), "..")

query_folder = folder_setup.query_name_setup(base_path)

webscraper.start_webscraper(query_folder)

general_data.start_general_statistics(query_folder)

by_chapter_data.start_by_chapter_statistics(query_folder)