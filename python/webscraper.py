import errno
import json
import os
import re
import requests
import time

from bs4 import BeautifulSoup

from story_constructor import story_to_dict

class Webscraper:

    """
    A class designed to webscrape the story lists of Archive of Our Own (AO3)

    Attributes
    ----------
    PAGE_NUMBER_INDICATOR : str
        a substring in the url that indicates to AO3 what page is being scraped
    folder_path : str
        the folder where json files of the webscraped data can be saved
    name : str
        the name given to the webscraper, used in labelling file outputs
    link : str
        the link of the AO3 category page that is being scraped
    first_page : int
        the first page in the category being scraped (is not necessarily 1)
    last_page : int
        the last page in the category possible to be scraped (found in pagination)

    Mathods
    -------
    scrape(link)
        webscrapes the story lists of AO3 from the category provided by the link
    get_datafile_path()
        returns the file path where stored json data of AO3 webscraped stories are
    """
    
    def __init__(self, name: str, folder_path: str) -> None:
        """
        Parameters
        ----------
        name : str
            the name given to the webscraper, used in labelling file outputs
        folder_path : str
            the folder where json files of the webscraped data can be saved
        
        Raises
        ------
        FileNotFoundError
            If the folder_path provided is not a directory that exists on the
            system computer.
        """

        self.PAGE_NUMBER_INDICATOR: str = "page="

        if self._folder_exists(folder_path):
            self.folder_path: str = folder_path
        else:
            raise FileNotFoundError(errno.ENOENT, os.strerror(errno.ENOENT), folder_path)

        # the name attribute is used in file creation
        # '/' characters in the name will conflict with os.path.join calls
        self.name: str = name.replace("/", "")
        
    def scrape(self, link: str) -> None:
        """Webscrapes the AO3 story listings contained on the website provided 
        by the link and outputs the story data to a json file.

        Parameters
        ----------
        link : str
            the link of the AO3 website category that is to be webscraped

        Parameter Restrictions
        ----------------------
        link : str
            1) the link must come from the Archive of Our Own (AO3) website domain\n
            2) the link must be an existing page on AO3

        Use Effects
        ------------
        1) the class object's attributes will be altered due to _set_link() call
        2) fetch request calls will be made to the provided link until completion
        3) intentional time.sleep delays will be made between fetches due to AO3 TOS
        4) a data file containing json objects of the scraped stories will be created
        5) webscraped stories will be dumped into formerly metioned file
        """

        # Delay time between page fetch requests to prevent hitting DoS protection
        # DO NOT REMOVE OR DECREASE, WILL VIOLATE AO3 TOS
        DELAY = 5

        # sets class link attributes for link, first_page, and last_page
        self._set_link(link)

        print(self.name + " will mine from " + str(self.first_page) + " to " + str(self.last_page) + ".")
        print("Approximate amount of time to complete: " + str(self.last_page * DELAY) + " seconds.")

        # file where webscraped data will be dumped for user and analytics
        with open(self.get_datafile_path(), 'w') as outfile:
            first = True

            # starting json data array
            outfile.write('[')
            
            for i in range(self.first_page, self.last_page + 1):
                print ("Currently mining page " + str(i) + " of " + str(self.last_page))

                content: BeautifulSoup = self._fetch_page_source(self.link, i)

                # the class "work" that designates what <li> tags are stories is hardcoded
                # and completely reliant on AO3 not changing their html structure
                stories = content.find_all('li', attrs={"class": "work"})

                for story in stories:
                    # determines if the story being dumped into json file is the first one
                    if (not first):
                        outfile.write(',\n')
                    else:
                        first = False

                    # each story object is dumped one at a time
                    # this is algorithmically simple, however, is also time consuming
                    json.dump(story_to_dict(story), outfile)
                    
                # time delay in place to prevent AO3 DoS protection from activating
                # on the last page, no more requests will be made, making delay unnecessary
                if i < self.last_page:
                    time.sleep(DELAY)

            # closes array of json stories
            outfile.write(']')

    def get_datafile_path(self) -> str:
        """Retuns the path to the json file where webscraped stories will be stored.\n
        This function DOES NOT guarantee the existence of said file."""
        return os.path.join(self.folder_path, self.name + ".json")

    def _set_link(self, link: str) -> None:
        """Centralized function that sets the class attributes of link, first_page,
        and last_page. A fetch request call will be made to the provided link.
        
        Use Effects
        -----------
        the class object's attributes will be altered
        """
        
        self.link: str = self._parse_link(link)

        # this call uses the originally passed link due to _parse_link() removing
        # the current page number from the url entirely
        self.first_page: int = self._fetch_first_page_number(link)

        # this call relies on the _parse_link() completing successfully
        self.last_page: int = self._fetch_last_page_number(self.link)

    def _fetch_page_source(self, link: str, current_page: int) -> BeautifulSoup:
        """Fetches the AO3 html source code on the current_page of the link and 
        returns it as a BeautifulSoup object for filtering and searching.
        
        Parameters
        ----------
        link : str
            the link of the AO3 website category that is to be webscraped
        current_page : int
            the page number of the AO3 website that is to be webscraped
        
        Parameter Restrictions
        ----------------------
        link : str
            1) the link must come from the Archive of Our Own (AO3) website domain\n
            2) the link must be an existing page on AO3\n
            3) the link must have the PAGE_NUMBER_INDICATOR tagged onto the end

        current_page : int
            the current_page number must be a page that exists within the linked category
        
        Use Effects
        ------------
        a fetch request call will be made to the provided link to get source html
        """

        iterating_url = link + str(current_page)
        response = requests.get(iterating_url, headers={'User-Agent': 'Mozilla/5.0'})
        content = BeautifulSoup(response.content, "html.parser")

        return content

    def _fetch_first_page_number(self, link: str) -> int:
        """Returns the first page accessed by the AO3 link provided.\n
        This function only parses the url and DOES NOT check the existence of the 
        website page.
        
        Parameters
        ----------
        link : str
            the link of the AO3 website category that is to be webscraped
        """

        page = 1

        if self.PAGE_NUMBER_INDICATOR in link:
            # capture group for the current page that the url accesses
            url_page_attribute = re.search(self.PAGE_NUMBER_INDICATOR + "(\d{1,})", link)

            if url_page_attribute:
                page = int(url_page_attribute.group(1))

        return page

    def _fetch_last_page_number(self, link: str) -> int:
        """Fetches the AO3 html source code and accesses the paginator to determine
        what the last possible page number on the website category is.
        
        Parameters
        ----------
        link : str
            the link of the AO3 website category that is to be webscraped
        
        Parameter Restrictions
        ----------------------
        link : str
            1) the link must come from the Archive of Our Own (AO3) website domain\n
            2) the link must be an existing page on AO3

        Function Restrictions
        ---------------------
        the current_page class attribute must be assigned before this function is called
        
        Use Effects
        ------------
        a fetch request call will be made to the provided link to get source html
        """

        web_content = self._fetch_page_source(link, self.first_page)

        # the class "pagination" that designates what <ol> tags are stories is hardcoded
        # and completely reliant on AO3 not changing their html structure
        pages_container_html = web_content.find("ol", attrs={"class": "pagination"})

        # the last_page value being the second to <li> in the pagination
        # is also reliant on AO3 html structure remaining static
        return int(pages_container_html.find_all("li")[-2].text)

    def _parse_link(self, link: str):
        """Alters the provided link to either move or add the PAGE_NUMBER_INDICATOR
        to the end of the link.\n
        This function only parses the url and DOES NOT check the existence of the 
        website page.
        
        Parameters
        ----------
        link : str
            the link of the AO3 website category that is to be webscraped
        """
        removed_link = re.sub(self.PAGE_NUMBER_INDICATOR + "\d*", '', link)

        if not '?' in removed_link:
            removed_link += "?"

        return (removed_link + "&" + self.PAGE_NUMBER_INDICATOR)

    def _folder_exists(self, folder_path: str) -> bool:
        """Returns whether or not the folder provided exists.
        
        Parameters
        ----------
        folder_path : str
            the path to the directory that is being checked
        """
        return os.path.exists(folder_path)