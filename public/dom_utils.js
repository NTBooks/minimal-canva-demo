// Feel free to ignore this, in a real app you'd use a front-end framework like React
function showById(id) {
    try {
        return document.getElementById(id).style.display = "block";
    } catch (e) {
        console.error(e);
    }
}

function hideById(id) {
    try {
        return document.getElementById(id).style.display = "none";
    } catch (e) {
        console.error(e);
    }
}

function setInnerText(id, text) {
    try {
        return document.getElementById(id).innerText = text;
    } catch (e) {
        console.error(e);
    }
}

function clearLocalStorage() {
    localStorage.clear();
    location.reload();
}