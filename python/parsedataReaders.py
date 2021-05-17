import json
from collections import Counter

tagsCounter = Counter()

read_file = open("ao3Data.json", "r")
json_array = json.load(read_file)

for story in json_array:
    for tag in story['tags']:
        tagsCounter.update({tag: story['views']})

with open("ao3ReaderStats.txt", 'w') as outfile:
    tagsKeys = tagsCounter.keys()
    for key, value in tagsCounter.most_common():
        outfile.write("Tag: " + key + ", Number: " + str(value) + "\n")

