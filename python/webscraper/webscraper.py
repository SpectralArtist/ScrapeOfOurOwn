import errno
import re
from bs4 import BeautifulSoup
import json
import os
import requests
import time

from .story_constructor import story_to_dict

class Webscraper:
    
    def __init__(self, name, folder_path):
        #Class Constant
        self.PAGE_NUMBER_INDICATOR = "page="

        if self._folder_exists(folder_path):
            self.folder_path = folder_path
        else:
            raise FileNotFoundError(errno.ENOENT, os.strerror(errno.ENOENT), folder_path)

        self.name = name
        
    def scrape(self, link):
        DELAY = 5

        self._set_link(link)

        print(self.name + " will mine from " + str(self.first_page) + " to " + str(self.last_page) + ".")
        print("Approximate amount of time to complete: " + str(self.last_page * DELAY) + " seconds.")

        with open(self.get_datafile_path(), 'w') as outfile:
            first = True

            outfile.write('[')
            
            for i in range(self.first_page, self.last_page + 1):
                print ("Currently mining page " + str(i) + " of " + str(self.last_page))

                content = self._fetch_page_source(self.link, i)
                stories = content.find_all('li', attrs={"class": "work"})

                for story in stories:
                    if (not first):
                        outfile.write(',\n')
                    else:
                        first = False

                    json.dump(story_to_dict(story), outfile)
                    
                if i < self.last_page:
                    time.sleep(DELAY)

            outfile.write(']')

    def get_datafile_path(self):
        return os.path.join(self.folder_path, self.name + ".json")

    def _set_link(self, link):
        self.link = self._parse_link(link)
        self.first_page = self._fetch_first_page_number(link)
        self.last_page = self._fetch_last_page_number(self.link)

    def _fetch_page_source(self, link, current_page):
        iterating_url = link + str(current_page)
        response = requests.get(iterating_url, headers={'User-Agent': 'Mozilla/5.0'})
        content = BeautifulSoup(response.content, "html.parser")

        return content

    def _fetch_first_page_number(self, link):
        page = 1

        if self.PAGE_NUMBER_INDICATOR in link:
            url_page_attribute = re.search(self.PAGE_NUMBER_INDICATOR + "(\d{1,})", link)

            if url_page_attribute:
                page = int(url_page_attribute.group(1))

        return page

    def _fetch_last_page_number(self, link):
        web_content = self._fetch_page_source(link, self.first_page)
        pages_container_html = web_content.find("ol", attrs={"class": "pagination"})
        return int(pages_container_html.find_all("li")[-2].text)

    def _parse_link(self, link):
        removed_link = re.sub(self.PAGE_NUMBER_INDICATOR + "\d*", '', link)

        if not '?' in removed_link:
            removed_link += "?"

        return (removed_link + "&" + self.PAGE_NUMBER_INDICATOR)

    def _folder_exists(self, folder_path):
        return os.path.exists(folder_path)