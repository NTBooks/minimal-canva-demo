// Feel free to ignore this, in a real app you'd use a front-end framework like React

// show by ID
function showById(id) {
    return document.getElementById(id).style.display = "block";
}

// hide by ID
function hideById(id) {
    return document.getElementById(id).style.display = "none";
}

// set id innerText
function setInnerText(id, text) {
    return document.getElementById(id).innerText = text;
}

function clearLocalStorage() {
    localStorage.clear();
    location.reload();
}