
/**
 * const handleMessage = (request, sender, sendResponse) => {
    if ("function: addterm")
    postTermData(request.addTerm)
    else if ("function: searchTerm")
    fetchTermDefinition(request.searchTerm).then((termObj) =>
    sendResponse(termObj));
    return true; //This "return true" is used to let chrome know that this is an async function
}
 */

/**
 * const postTermData = async (termData) => {
    const response = await fetch("https://get-server-prod.herokuapp.com/addterm", {
        method: 'POST',
        mode: 'cors', // no-cors, *cors, same-origin
        body: JSON.stringify(termData);
    });
    console.log(response) //Your term has been successfully added / term is already requested, added to notifications lsit
}
/**
 */