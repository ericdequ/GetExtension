# import necessary libraries
import requests
from bs4 import BeautifulSoup
import csv
import json

#Create a dictionary with terms from dataJSon

#Open json file that got all of the Nist terms
with open('C:\Emerging Tech\GetApp\ChromeExtension\data.json') as json_file:
    dic = json.load(json_file)
    print("type:",type(dic))

# makes counter to ensure it iterates throughout all the terms and doesnt get stuck half way
count = 0

# Makes a list from the dictionary to iterate throughout it faster
lol = list(dic)

#Create a loop to iterate throughout the dictionary
for x in lol:
    count = count + 1
    #print("term name is: ",x)

    #opens up the page for each term
    base_url = "https://csrc.nist.gov/glossary/term/"
    url = base_url + x
    # Make a variable that stores the HTML contents of the url
    r = requests.get(url)
    # makes an item to scrape the html content with the html parser
    soup = BeautifulSoup(r.content, 'html.parser')

    #Prints count every 100 terms to ensure program is running properly increase modulo to speed up program
    if count%100 == 0:
        print(count)

    # initilizes strings to store the data once its scrapped
    Abrevation_Data = ""
    Definition_Data = ""
    Source_Data = ""

    #Makes a list to store all the data for the term
    Term_Values = []

    # A try catch so program doesnt terminate when there is an invalid case and only gathers acroynm data
    try:
    #gathers the Abreviation data
        Abrevation_Data = soup.find('a', attrs={'id': 'term-abbr-link-0'}).contents[0]
    #print(Abrevation_Data)
    # Gather Definition
        Definition_Data = soup.find('i', attrs={'id': 'term-def-none'}).contents[0]
    #print(Definition_Data)
    # Gather source
        Source_Data = soup.find('a', attrs={'id': 'term-abbr-0-src-link-0'}).contents[0]
    #print(Source_Data)

    # except cases for errors
    except AttributeError:
        print("not defined")
    except:
        print("Something else went wrong")



    #Append the 3 data objects to the list for the desired term
    Term_Values.append(str(Abrevation_Data))
    Term_Values.append(str(Definition_Data))
    Term_Values.append(str(Source_Data))


    #Append list to term in dictionary 
    dic[x] = Term_Values

print("Done about to dump")
# Turn the new dictionary into a json file
try:
    with open('JSONs/data_w_value1.json', 'w', encoding='utf-8') as f:
        json.dump(dic, f, ensure_ascii=False, indent=4)

except:
    print("Something went wrong")

# prints counter to ensure entire Json file is iterated through
print("Count of all terms", count)
