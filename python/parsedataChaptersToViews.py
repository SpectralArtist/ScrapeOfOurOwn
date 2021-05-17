import json
from collections import Counter

chaptersCounter = Counter()
viewsCounter = Counter()
ratioCounter = Counter()

read_file = open("ao3Data.json", "r")
json_array = json.load(read_file)

for story in json_array:
    for tag in story['tags']:
        viewsCounter.update({tag: story['views']})
        chaptersCounter.update({tag: story['chapters']})

with open("ao3ChaptersToViewsCH500.txt", 'w') as outfile:
    viewsKeys = viewsCounter.keys()

    rankCount = 1

    for key, value in viewsCounter.most_common():
        if (chaptersCounter[key] >= 500):
            ratioCounter.update({key : value / chaptersCounter[key]})
            
    for key, value in ratioCounter.most_common():
        outfile.write("Rank: " + str(rankCount) + ", Tag: " + key + ", Number: " + str(value) + "\n")
        rankCount += 1

    

