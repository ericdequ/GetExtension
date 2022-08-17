// background.js

 const useAcronymAPI = async (search_term, recipient) => {
    let sent = chrome.runtime.sendMessage( 
        {
            search_term: search_term,
            recipient: recipient
        }
    )
    sent.then(handleAPISearchResponse, handleError);
}
const handleAPISearchResponse = (response) => {
    
}
const handleError = (err) => {
    console.log(err);
}
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
    
    
    const sanitizedSearchTerm = encodeURIComponent(search_term);
    
    const data = await fetch("https://get-server-prod.herokuapp.com/glossary?term=" + sanitizedSearchTerm + '&results_per_page=' + results_per_page + '&page=' + page) // async functionality example (fetching from pokemon database)
    const terms = await data.json(); //Wait for data to be jsonified
    
    let total_pages = await fetch("https://get-server-prod.herokuapp.com/glossary/searchsize?collection_alias=glossary&search_term=" + sanitizedSearchTerm);
    
    total_pages = await total_pages.json();
    
    let responseObj = {
       total_pages: Math.floor(total_pages.totalElements/3) + 1,
       results: terms
    }
    if (!terms || terms.length < 1)
    {
        await useAcronymAPI(search_term, 'popup-script');
        responseObj = {acronymAPI: true};
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
    const data = await fetch("https://get-server-prod.herokuapp.com/glossary?term=" + sanitizedSearchTerm + '&results_per_page=3&page=1');
    const terms = await data.json();
    
    if (!terms || terms.length < 1)
        useAcronymAPI(search_term, 'content-script');
    
    const responseObj = terms;
    
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

