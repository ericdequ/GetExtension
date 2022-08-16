let getText = (e) => {
    let selectedText = document.getSelection().toString();
    console.log(selectedText);
    let sent = chrome.runtime.sendMessage({
        selected_text: selectedText
    })
    sent.then(handleResponse, handleError)
}

document.addEventListener('mouseup', (e) => getText(e));

const handleResponse = (termObj) => {
    constructDefinitionsPopup(termObj);
    
}
const handleError = (err) => {
    console.log("An error in the messaging process between content script and background script occured");
    console.log("The error is the following: " + err);
}