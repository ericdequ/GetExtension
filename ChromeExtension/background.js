// background.js
//Extracting to async await function fetchTermDefinition cuz chrome is iffy
const handleMessage = (request, sender, sendResponse) => {
    
    fetchTermDefinition(request.searchTerm).then((termObj) =>
    sendResponse({term : termObj.term, definition: termObj.definition, standards: termObj.standards}));
    return true;
}

//This is where the fancy stuff is supposed to happen
const fetchTermDefinition = async (search_term) => {

    //Now, search_term should be appropriately parsed to perform definition search;
    //someParsingFunction(search_term)

    //Here, we format our http request and use the native Fetch api to hand off all of the heavy processing and search to an external server
    //Since we dont have a server yet, I am using the pokemon api as an example.
     const data = await fetch("https://pokeapi.co/api/v2/pokemon/pidgey")
     const pokemon = await data.json();
     console.log(pokemon.base_experience);



    //Placeholder return since we dont have a db yet
    return {term: search_term, definition: "Some fake definition", standards: "NIST probably"};
}

chrome.runtime.onMessage.addListener(handleMessage);