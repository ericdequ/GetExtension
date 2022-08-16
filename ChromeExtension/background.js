// background.js

//Heres a rundown of how background.js's Search Functionality Works
/**
 * 1. popup.js sends a message to backgroundjs, including the term to be searched
 * 2. background.js receives the message and handles it by doing something, in this case fetching the definition via fetchTermDefinition
 * 3. fetchTermDefinition makes a request to the server that handles our JSON database, when the server responds, fetchTermDefinition returns this data.
 * 4. fetchTermDefinition should also take care of any parsing/string manipulation, unless the server does that for us
 * 4. handleMessage takes the return value of fetchTermDefinition and sends it back to popup.js, which is tasked with putting the data on screen
 */


/**
 * 
 * @param {object {searchTerm: string}} request an object containing a search term and in the future any other information necessary (like filters/categories/specific standards org) to narrow the search
 * @param {Some odd Object thing} sender stuff relating to the original sender, popup.js
 * @param {Callback Func} sendResponse Sends a response back to the original message sender, in this case popup.js
 * @returns true to let chrome know the function is asynchronous
 */
const handleMessage = (request, sender, sendResponse) => {
    if (request.type && request.type == 'highlight')
        fetchHighlightDefinition(request.selected_text).then((termObj) => {
            sendResponse(termObj);
        });
    else
        fetchTermDefinition(request.searchTerm, request.page, request.results_per_page).then((termObj) =>
        sendResponse(termObj)
        );
    return true; //This "return true" is used to let chrome know that this is an async function
}

/**
 * @function fetchTermDefinition
 * @param {string} search_term The term to be searched for
 * @param {int} page The page of results you are trying to obtain -
 * @param {int} results_per_page The maximum amount of results you want to show up per page
 * @returns {object} An object containing the searched term, the definition obtained from the db, and the standards organization that provided this definition
 */
const fetchTermDefinition = async (search_term, page, results_per_page) => {
    
    ///search_term is sanitized into a format appropriate for the a url to be used in fetch()
    //someSanitizationFunction(search_term)
    const sanitizedSearchTerm = encodeURIComponent(search_term);
    //Since we dont have a server yet, I am using the pokemon api as an example.
     const data = await fetch("https://get-server-prod.herokuapp.com/glossary?term=" + sanitizedSearchTerm + '&results_per_page=' + results_per_page + '&page=' + page) // async functionality example (fetching from pokemon database)
     const terms = await data.json(); //Wait for data to be jsonified
     let total_pages = await fetch("https://get-server-prod.herokuapp.com/glossary/searchsize?collection_alias=glossary&search_term=" + sanitizedSearchTerm);
     total_pages = await total_pages.json();
     console.log(terms);
    const responseObj = {
        total_pages: Math.floor(total_pages.totalElements/3) + 1,
        results: terms
    }
    //Return data obtained THERE WE GO
    return responseObj;
}
const sanitizeSelectedText = (text) => {
    //If string is hella long
    text = text.substr(0, 30);
    //If string has any funky characters
    let almostSanitized = text.replace(/[^\w\s]/gi, '');
    //Encode for use in URL
    const fullySanitized = encodeURIComponent(almostSanitized);
    
    return fullySanitized;
}
const fetchHighlightDefinition = async (selected_text) => {
    const sanitizedSearchTerm = sanitizeSelectedText(selected_text);
    const data = await fetch("https://get-server-prod.herokuapp.com/glossary?=term" + sanitizedSearchTerm + '&results_per_page=1&page=1');
    const term = await data.json();
    
    console.log(term);
    const responseObj = term;
    
    return responseObj;
}
/** 
 * For a term
 * https://csrc.nist.gov/glossary/term/jamming
 * For a search
 * https://csrc.nist.gov/glossary?keywords-sm=Shlang&sortBy-sm=relevance&ipp-sm=100
 * where ? signifies the start of query
 * ipp-sm = limit
 * keywords = search term
 * sortBy= sorting method
 * glossary = just the directory for the glossary
 */

//Listens for when popup.js sends a message
chrome.runtime.onMessage.addListener(handleMessage);
