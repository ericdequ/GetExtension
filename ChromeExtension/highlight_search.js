let currentItems = []; 
let current_page = null;
let total_pages = null;

//Basically a pocket version of the popup functionality
let initialSetup = () => {
    const body =  document.getElementsByTagName('body')[0];
    const popupContainer = document.createElement('div');
    popupContainer.className = "fake-popup-container";
    body.appendChild(popupContainer);
    console.log("Initial Setup Completed");
}
let getText = (e) => {
    if (document.getElementsByClassName('teal-background')[0] && document.getElementsByClassName('teal-background')[0].contains(e.target))
        return;
    let selectedText = document.getSelection().toString();
    if (!selectedText) return;
    console.log(selectedText);
    let sent = chrome.runtime.sendMessage({
        selected_text: selectedText,
        type: "highlight"
    })
    sent.then(handleResponse, handleError);
}
const navigateDefinitionsPopup = (term) => {
    //animate out contents and animate in new contents
    let popup_element = `
    <div class="grow-please"></div>
    <div class="teal-background">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
        rel="stylesheet"
      />
      <div class="white-overlay">
        <div class="term-fake-page">
          <div class="ET-logo"></div>
          <!--<image src="images/xmark.png" id="quit-term-page" />-->
          <div class="term-fake-page-title">${term.TITLE}</div>
          <div class="term-fake-page-description">
            ${term.DESCRIPTION && term.DESCRIPTION != "None" ? term.DESCRIPTION : "No Description Available. "}
          </div>
          <div class="term-fake-page-sources">

            <div class="term-page-source-list">
              ${term.SOURCE ? term.SOURCE : "N/A"}
            </div>
          </div>
          <div class="term-fake-page-abbreviations">
            <div class="term-fake-page-abbr-header">Abbreviations</div>
            <div class="term-page-abbr-flex">
              <div class="term-page-abbr">${term.ABBREVIATIONS ? term.ABBREVIATIONS : "N/A"}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="pagination-group">
        <div id="prev-page-button">Prev</div>
        <div id="page-input">${current_page + "/" + total_pages}</div>
        <div id="next-page-button">Next</div>
      </div>
    </div>
    `
    document.getElementsByClassName("fake-popup-container")[0].innerHTML = popup_element;
    const handleRemovePopup = (e) => {
        if ((document.getElementsByClassName('teal-background')[0] && document.getElementsByClassName('teal-background')[0].contains(e.target)) || (document.getElementsByClassName('teal-background-2')[0] && document.getElementsByClassName('teal-background-2')[0].contains(e.target))){
            // Do nothing
        } 
        else{
            // Clicked outside the box
            document.getElementsByClassName('fake-popup-container')[0].innerHTML="";
            window.removeEventListener('mouseup', handleRemovePopup);
            current_page = null;
            currentItems = [];
        }
    }
    const handleNextPage = (e) => {
        if (current_page + 1 <= 3)
        {
            current_page += 1;
            navigateDefinitionsPopup(currentItems[current_page-1]);
        }
    
    }
    const handlePrevPage = (e) => {
        if (current_page - 1 >= 1)
        {
            current_page -= 1;
            navigateDefinitionsPopup(currentItems[current_page-1]);
        }
    }
    document.getElementById('prev-page-button').addEventListener('click', handlePrevPage);
    document.getElementById('next-page-button').addEventListener('click', handleNextPage);
    window.addEventListener('mouseup', handleRemovePopup);
}
const constructDefinitionsPopup = (term) => {
    let popup_element;
    console.log(term);
    if (!term) 
    {
        popup_element = `
        <div class="teal-background-2">
            <div class="white-overlay-2">
            <div class="ET-logo"></div>
            <div class="term-fake-page-title-2">No Results</div>
            </div>
        </div>
        `
    }
    else
    {
        popup_element = `
            <div class="grow-please"></div>
            <div class="teal-background">
              <link rel="preconnect" href="https://fonts.googleapis.com" />
              <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
              <link
                href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
                rel="stylesheet"
              />
              <div class="white-overlay">
                <div class="term-fake-page">
                  <!--<image src="images/xmark.png" id="quit-term-page" />-->
                  <div class="ET-logo"></div>
                  <div class="term-fake-page-title">${term.TITLE}</div>
                  <div class="term-fake-page-description">
                    ${term.DESCRIPTION && term.DESCRIPTION != "None" ? term.DESCRIPTION : "No Description Available. "}
                  </div>
                  <div class="term-fake-page-sources">

                    <div class="term-page-source-list">
                      ${term.SOURCE ? term.SOURCE : "N/A"}
                    </div>
                  </div>
                  <div class="term-fake-page-abbreviations">
                    <div class="term-fake-page-abbr-header">Abbreviations</div>
                    <div class="term-page-abbr-flex">
                      <div class="term-page-abbr">${term.ABBREVIATIONS ? term.ABBREVIATIONS : "N/A"}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="pagination-group">
                <div id="prev-page-button">Prev</div>
                <div id="page-input">${current_page + "/" + total_pages}</div>
                <div id="next-page-button">Next</div>
              </div>
            </div>
            `
    }

    document.getElementsByClassName("fake-popup-container")[0].innerHTML = popup_element;
    const handleRemovePopup = (e) => {
        if ((document.getElementsByClassName('teal-background')[0] && document.getElementsByClassName('teal-background')[0].contains(e.target)) || (document.getElementsByClassName('teal-background-2')[0] && document.getElementsByClassName('teal-background-2')[0].contains(e.target))){
            // Do nothing
        } 
        else{
            // Clicked outside the box
            document.getElementsByClassName('fake-popup-container')[0].innerHTML="";
            window.removeEventListener('mouseup', handleRemovePopup);
            current_page = null;
            currentItems = [];
        }
    }
    const handleNextPage = (e) => {
        if (current_page + 1 <= 3)
        {
            current_page += 1;
            navigateDefinitionsPopup(currentItems[current_page-1]);
        }
    
    }
    const handlePrevPage = (e) => {
        if (current_page - 1 >= 1)
        {
            current_page -= 1;
            navigateDefinitionsPopup(currentItems[current_page-1]);
        }
    }
    if (term)
    {
        document.getElementById('prev-page-button').addEventListener('click', handlePrevPage);
        document.getElementById('next-page-button').addEventListener('click', handleNextPage);
    }
    window.addEventListener('mouseup', handleRemovePopup);
}

const handleResponse = (termObj) => {
    currentItems = termObj;
    console.log(currentItems);
    current_page = 1;
    total_pages = currentItems.length;
    constructDefinitionsPopup(termObj[0]);
    
}
const handleError = (err) => {
    console.log("An error in the messaging process between content script and background script occured");
    console.log("The error is the following: " + err);
}

document.addEventListener('mouseup', (e) => getText(e));
initialSetup();
