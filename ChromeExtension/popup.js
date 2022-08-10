let current_page = null; //null when no search performed
let total_pages = null; //null when no search performed
let currentItems = []; //Empty Object 
let current_search = null;
const previous_page = null;
//Watch this gameplay
const constructResultsNotFoundComponent = () => {

}
const handleDeployTermPage = (current_term) => {
    //cache previous page, or at least the params that denote the previous page, and provide a page that focuses on term-related info
    console.log('this runs with the term: ' + current_term.TITLE);
}
const constructPagination = (current_page, total_pages) => {
    const paginationElement = document.getElementById('pagination');
    paginationElement.innerHTML = '';
    paginationElement.innerHTML = `
    <div class="flex-center">
        <div class="pagination_element" id="pagination">
            <div id="prev_page" class="pagination_left"><img class="chevron_pagi" src="images/chevron-left-solid.png"></div>
            <div class="pagination_page">
                <div id="current_page">${current_page}</div>
                <div class="slash">/</div>
                <div id="total_pages">${total_pages}</div>
            </div>
            <div id="next_page" class="pagination_right"><img class="chevron_pagi" src="images/chevron-right-solid.png"></div>
        </div>
    </div>
    
    `;

    const prev_page = document.getElementById('prev_page');
    const next_page = document.getElementById('next_page');

    next_page.addEventListener('click', () => {
        handleNextPage();
    })
    prev_page.addEventListener('click', () => {
        handlePrevPage();
    })
}

const constructPage = (current_page, total_pages, page_items = []) => {
    //Empty the page
    document.getElementsByClassName('result-wrapper')[0].innerHTML = "";
    //assume that page_items is an array of term objects
    page_items.map((term, index) => {
        let title = term.TITLE;
        let definition_or_abbreviations = term.DEFINITION ? term.DEFINITION : term.ABBREVIATIONS;
        let standards = term.SOURCE ? term.SOURCE : "";
        // Identify each of the term windows with the index of the term, which then helps for setting event listeners on click
        document.getElementsByClassName("result-wrapper")[0].innerHTML += 
        `
        <div class="term-result-window-${index}"> 
            <div class="term-result">
                ${title}
            </div>
            <div class="term-definition">
                ${definition_or_abbreviations}
            </div>
            <div class="term-standard-organization">
                ${standards}
            </div>
        </div> 

        `
    });

    //Once all results have been put into DOM, assign event listeners to each that detect the click and perform the corresponding action

    page_items.forEach((term, index) => {
        const termButton = document.getElementsByClassName(`term-result-window-${index}`)[0];
        termButton.addEventListener('click', () => {
            handleDeployTermPage(term)
        })
    })
    
    //Once event listeners are instantiated, then focus on pagination
    constructPagination(current_page, total_pages);
}




const getSearchOptions = async () => {
    return new Promise( (resolve, reject) => {
        return chrome.storage.local.get(['search_options'], (result) => {
            if (Object.keys(result).length == 0) // IF the search_options have not been set, then populate as default
            {
                //These are the default settings. Right now, just results_per_page
                const default_search_options = {
                    results_per_page: 5,
                }
                return chrome.storage.local.set({ 'search_options': JSON.stringify(default_search_options) }, async () => {
                    resolve(default_search_options)
                })
            }
            resolve(result.search_options)
        })
    })
}
const handleNextPage = async () => {
    if (current_page + 1 > total_pages)
        return null;
    current_page = current_page + 1;
     if (current_search.length > 0)
     {
        let sent = chrome.runtime.sendMessage({
            searchTerm: current_search,
            page: current_page,
            results_per_page: 3
        })
        sent.then(handleResponse, handleError)
     } 
}
const handlePrevPage = async () => {
    if (current_page - 1 < 1)
        return null;
    current_page = current_page - 1
    await getSearchOptions().then(async (search_options) => {
        let search_options_json = JSON.parse(search_options);
    
        if (current_search.length == 0)
            return null;
        else {
            let sent = chrome.runtime.sendMessage({
                searchTerm: current_search,
                page: current_page,
                results_per_page: parseInt(search_options_json['results_per_page'])
            })
            sent.then(handleResponse, handleError)
        }   
    })
}
const handleSearchButtonActions = async () => {
    await getSearchOptions().then(async (search_options) => {
        let search_options_json = JSON.parse(search_options);

        //setting global values
        current_search = document.getElementById("term").value;
        current_page = 1;
        total_pages = 1;

        if (current_search.length == 0)
            return null; //aka do nothing
        else {
            let sent = chrome.runtime.sendMessage({
                searchTerm: current_search,
                page: 1,
                results_per_page: parseInt(search_options_json['results_per_page'])
            })
            sent.then(handleResponse, handleError)
        }   
    })
    
}

const leaveDetailedTermWindow = () => {

}



//First, grab the button element from the popup dom
const getButton = document.getElementById("getButton");
// Then, add an event listener to the button so that when the button is clicked-> send the data to the content script
getButton.addEventListener("click", () => {
    handleSearchButtonActions();
})

/**
 * @note @func handleResponse has been restructured and now handles data differently
 * @param {object} message 
 */
//handleResponse
const handleResponse = async (message) => {
    total_pages = message.total_pages;
    currentItems = message.results;

    constructPage(current_page, total_pages, currentItems)
}
const handleError = (err) => {
    console.log("Error ocurred: " + err);
}
