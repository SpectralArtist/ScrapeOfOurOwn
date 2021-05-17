from bs4 import BeautifulSoup
import json
import os
import requests
import time

from .story_constructor import story_to_dict
from . import url_parsing
from references import strings as sref

def start_webscraper(query_folder):
    url = input("Please enter the link to be mined: ")
    print ("")

    current_page = url_parsing.get_current_page_number(url)
    separated_url = url_parsing.separate_url(url)
    page_source = fetch_page_source(separated_url, current_page)
    last_page = url_parsing.get_last_page_number(page_source)

    print("The system will mine from " 
          + str(current_page) + " to " 
          + str(last_page) + ".")

    story_collection(query_folder, separated_url, current_page, last_page)

def fetch_page_source(separated_url, current_page):
    iterating_url = (separated_url[0] 
                    + sref.PAGE_NUMBER_INDICATOR 
                    + str(current_page) 
                    + separated_url[1])
    response = requests.get(iterating_url, headers={'User-Agent': 'Mozilla/5.0'})
    content = BeautifulSoup(response.content, "html.parser")

    return content

def story_collection(query_folder, separated_url, current_page, last_page):
    with open(os.path.join(query_folder, sref.WEBSCRAPED_DATA_FILE_NAME), 'w') as outfile:

        outfile.write('[')
        
        first = True

        for i in range(current_page, last_page + 1):
            print ("Currently mining page " + str(i) + " of " + str(last_page))

            content = fetch_page_source(separated_url, i)
            stories = content.find_all('li', attrs={"class": "work"})

            for story in stories:
                if (not first):
                    outfile.write(',\n')
                else:
                    first = False

                json.dump(story_to_dict(story), outfile)
                
            if i < last_page:
                time.sleep(5)

        outfile.write(']')