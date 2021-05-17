import re

from references import strings as sref

def get_current_page_number(url):
    current_page = 1

    if sref.PAGE_NUMBER_INDICATOR in url:
        url_page_attribute = re.search(sref.PAGE_NUMBER_INDICATOR + "(\d{1,})", url)

        if url_page_attribute:
            current_page = int(url_page_attribute.group(1))

    return current_page

def get_last_page_number(web_content):
    pages_container_html = web_content.find("ol", attrs={"class": "pagination"})
    return int(pages_container_html.find_all("li")[-2].text)

def separate_url(url):
    separated_url = []

    if sref.PAGE_NUMBER_INDICATOR in url:
        url_page_attribute = re.search(sref.PAGE_NUMBER_INDICATOR + "(\d{1,})", url)

        if url_page_attribute:
            separated_url = re.split(sref.PAGE_NUMBER_INDICATOR + "\d{1,}", url)
        else:
            separated_url = re.split(sref.PAGE_NUMBER_INDICATOR, url)
    elif "?" in url:
        separated_url = [url + "&", '']
    else:
        separated_url = [url + "?", '']

    return separated_url