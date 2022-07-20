# Script to get all nist terms off page
# Still need to implement grabbing definition and sources and storing them in a database

# import necessary libraries
import requests
from bs4 import BeautifulSoup
import csv
import json

# found url that contains all nist terms on one page
url = "https://csrc.nist.gov/glossary?sortBy-lg=relevance&ipp-lg=all"

# Make a variable that stores the HTML contents of the url
r = requests.get(url)

# makes an item to scrape the html content with the html parser
soup = BeautifulSoup(r.content, 'html.parser')
# print(soup)

quotes=[]  # a list to store quotes

data={}
table = soup.find('div', attrs = {'id':'results-container'})
# print(table)
for x in table.findAll('div', attrs = {'class':'col-sm-12 term-list-title'}):
    temp = str((x.find('a').contents[0]))
    data[temp] = ""

with open('data.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=4)

# TODO
# take list and go to each page and repeat process to get definition and source
# store in file