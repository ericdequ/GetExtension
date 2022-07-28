//First, grab the button element from the popup dom
const getButton = document.getElementById("getButton");
// Then, add an event listener to the button so that when the button is clicked-> send the data to the content script
getButton.addEventListener("click", () => {
    let search_query = document.getElementById("term").value;
    if (search_query.length == 0)
    {
        //Literally do nothing

    }
    else {
        let sent = chrome.runtime.sendMessage({
            searchTerm: search_query,
        })
        sent.then(handleResponse, handleError)
    }   
    
})
//I'm also going to add some message handlers for the  chrome.runtime.sendMessage process
const handleResponse = async (messages) => {
    //Message should include the term, definition, and standards organization
    //Object destructuring
    document.getElementsByClassName('result-wrapper')[0].innerHTML = "";
    console.log(messages);
    messages.forEach((message) => {
        let term = message.TITLE;
        let definition = message.ABBREVIATIONS;
        let standards = message.SOURCE;
        //The definition of the search term and the term itself are now displayed
        console.log("Term: " + term);
        console.log("Definition: " + definition);
        console.log("Standard: " + standards);
        //Now its time for us to display the definitions via popup.js
        document.getElementsByClassName("result-wrapper")[0].innerHTML += `
        <div class="term-result-window"> 
            <div class="term-result">
                ${term}
            </div>
            <div class="term-definition">
                ${definition}
            </div>
            <div class="term-standard-organization">
                ${standards}
            </div>
        </div> 
        `
    })
}
const handleError = (err) => {
    console.log("Error ocurred: " + err);
}
