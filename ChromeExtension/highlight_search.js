let currentItems = []; 
let current_page = null;

//Basically a pocket version of the popup functionality
let initialSetup = () => {
    const body =  document.getElementsByTagName('body')[0];
    const popupContainer = document.createElement('div');
    popupContainer.className = "fake-popup-container";
    body.appendChild(popupContainer);
    console.log("Initial Setup Completed");
}
let getText = (e) => {
    let selectedText = document.getSelection().toString();
    if (!selectedText) return;
    console.log(selectedText);
    let sent = chrome.runtime.sendMessage({
        selected_text: selectedText,
        type: "highlight"
    })
    sent.then(handleResponse, handleError);
}

const constructDefinitionsPopup = (termObj) => {
    const popup_element = `
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
          <div class="term-fake-page-title">Fake Term</div>
          <div class="term-fake-page-description">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Elit
            duis tristique sollicitudin nibh sit amet commodo nulla facilisi.
          </div>
          <div class="term-fake-page-sources">
            <div class="term-page-source-list">
              NIST SMP 1.20
            </div>
            <div class="term-page-source-list">
              NIST SMP 1.20
            </div>
            <div class="term-page-source-list">
              NIST SMP 1.20
            </div>
          </div>
          <div class="term-fake-page-abbreviations">
            <div class="term-fake-page-abbr-header">Abbreviations</div>
            <div class="term-page-abbr-flex">
              <div class="term-page-abbr">FT</div>
              <div class="term-page-abbr">FTP</div>
              <div class="term-page-abbr">MLG</div>
            </div>
          </div>
        </div>
      </div>
      <div class="pagination-group">
        <div id="prev-page-button">Prev</div>
        <div id="page-input">1/3</div>
        <div id="next-page-button">Next</div>
      </div>
    </div>
    `
    document.getElementsByClassName("fake-popup-container")[0].innerHTML = popup_element;
    document.getElementsByClassName('teal-background')[0].addEventListener('mouseup', () => {
        document.getElementsByClassName('fake-popup-container')[0].innerHTML = "";
    })
}

const handleResponse = (termObj) => {
    console.log(termObj);
    constructDefinitionsPopup(termObj);
    
}
const handleError = (err) => {
    console.log("An error in the messaging process between content script and background script occured");
    console.log("The error is the following: " + err);
}

document.addEventListener('mouseup', (e) => getText(e));
initialSetup();
