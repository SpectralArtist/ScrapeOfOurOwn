import os
import json
import matplotlib.pyplot as plt
import pandas as pd
import folder_setup
from storyanalyzer import StoryAnalyzer as SAnalyzer
import strings as sref

def main():
    base_path = os.path.join(os.path.dirname(__file__), "..")

    query_folder = folder_setup.query_name_setup(base_path)

    print(query_folder)

    link = input("Please enter the link to be mined: ")
    name = "All Stories"

    all_stories = SAnalyzer("All Stories", query_folder)
    all_stories.scrape(link)
    all_stories.run_all()

    for section in sref.BY_CHAPTER_SECTIONS:
        folder_path = folder_setup.create_sub_folder(query_folder, section)
        section_analyzers = split_storyanalyzer(all_stories, section, folder_path)

        for analyzer in section_analyzers:
            analyzer.run_all()
            graph_file_path = os.path.join(analyzer.folder_path, analyzer.name.replace('/', '') + " By Chapter Graph.png")
            generate_by_chapter_graph(graph_file_path, analyzer, all_stories)
            
        section_analyzers.append(all_stories)
        graph_file_path = os.path.join(folder_path, section.replace('/', '') + " By Chapter Graph.png")
        generate_by_chapter_graph(graph_file_path, *section_analyzers)

def split_storyanalyzer(analyzer: SAnalyzer,
                        section: str,
                        folder_path: str=None) -> list[SAnalyzer]:
    if section not in sref.BY_CHAPTER_SECTIONS: return
    
    storyanalyzer_list: list[SAnalyzer] = []
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
        temp_analyzer = SAnalyzer(group_key, sub_folder_path)
        temp_analyzer.set_stories(story_list)
        storyanalyzer_list.append(temp_analyzer)

    return storyanalyzer_list

def generate_by_chapter_graph(file_path, *analyzers):   
    fig = plt.gcf()
    chapters = []
    groups = []
    view_averages = []

    for analyzer in analyzers:
        by_chapter_data = json.load(open(analyzer.get_by_chapter_datafile_path(), 'r'))
        

        for chapter, counts in sorted(by_chapter_data.items(), key=lambda x: int(x[0]), reverse=False):
            stories = counts[sref.STORY_COUNT_SECTION]
            views = counts[sref.VIEWS_SECTION]

            chapters.append(int(chapter))
            groups.append(analyzer.name)
            view_averages.append(views / stories)

    df = pd.DataFrame({"groups": groups, "view_averages": view_averages, "chapters": chapters}).sort_index()
    df.pivot(index = "chapters", columns = "groups", values = "view_averages").plot(kind='bar', color=COLOR_DICT)
    plt.xticks(rotation = 0)

    plt.title("Average Views vs. Chapter Count, Clustered by Section")
    plt.ylabel("Average View Counts")

    fig = plt.gcf()
    fig.set_size_inches(18.5, 10.5)
    fig.savefig(file_path, dpi=100)
    plt.close(fig)
    plt.clf()

COLOR_DICT = {
    "All Stories": "#17202a",

    "Choose Not To Use Archive Warnings": "#f1c40f",
    "Graphic Depictions Of Violence": "#cb4335",
    "Major Character Death": "#717d7e",
    "No Archive Warnings Apply": "#27ae60",
    "RapeNon-Con": "#8e44ad",
    "Underage": "#2980b9",

    "Complete Work": "#1e8449",
    "Work in Progress": "#b03a2e",

    "Explicit": "#cb4335",
    "General Audiences": "#27ae60",
    "Mature": "#e67e22",
    "Not Rated": "#7f8c8d",
    "Teen And Up Audiences": "#f4d03f",

    "FF": "#cb4335",
    "FM": "#7d3c98",
    "Gen": "#28b463",
    "MM": "#2e86c1",
    "Multi": "#34495e",
    "No category": "#17202a",
    "Other": "#839192"
}

main()