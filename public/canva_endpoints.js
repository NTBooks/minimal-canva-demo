function CanvaFetch(apiroute, method = "GET", body = null) {

    if (!localStorage.getItem('canvaToken')) return null;

    return fetch('https://api.canva.com/rest/v1/' + apiroute, {
        method: method,
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('canvaToken')}`,
            'Content-Type': 'application/json',

        },
        body: body ? JSON.stringify(body) : undefined
    });
}


//     // NOT USED, example of how you can call the Canva API to create a new design on the client instead of the server
// async function CreateNewDesign() {
//     const canvaresult = await CanvaFetch("designs", "POST", {
//         "title": "ChainLetter Credential",
//         "design_type": {
//             "type": "preset",
//             "name": "whiteboard"
//         },
//     });

//     const canvapack = await canvaresult.json();
//     if (!canvapack?.design) return;
//     // create correlation_state to add to the edit link, which lets us know which design we are editing later
//     const correlation_state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
//     location.href = canvapack.design.urls.edit_url + `&correlation_state=${correlation_state}`;

// }