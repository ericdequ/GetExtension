# import necessary libraries
import requests
from bs4 import BeautifulSoup
import csv
import json

# initilizes base url and Dictionary for scrapping
base_url = "https://www.cms.gov/acronyms?searchterm=&items_per_page=30&viewmode=grid&page="
data = {}
count = 0
count1 = 0


# uses this code to iterate through all the pages to gather all acroynms since page can only display 30 results at a time
for x in range(147):
    url = base_url + str(x)
# Make a variable that stores the HTML contents of the url
    r = requests.get(url)
# makes an item to scrape the html content with the html parser
    soup = BeautifulSoup(r.content, 'html.parser')
# print(soup)
    print("made a soup")


# needs to change for cms website this code is still for NIST
    table = soup.find('div', class_=['view-content','cols-2'])
    last_word = ""
    for x in table.findAll('tr'):
        try:
            g = str(x.find('td', attrs = {'class':'views-field views-field-title is-active'}).contents[0])
            #print(g.contents[0])
            h = str(x.find('td', attrs = {'class':'views-field views-field-body'}).contents[0])
            data[g] = h
        except AttributeError:
            count = count + 1
        except:
            count1 = count1 + 1
            print("other error")


print("AttributeError total = ",count," now starting to ship to Json")
print("Other Error total = ",count1," now starting to ship to Json")

# Dumps to Json file
with open('JSONs/CMSdata.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=4)

# simple print statement to ensure the Json file completed dumping of contents
#print("Over")
