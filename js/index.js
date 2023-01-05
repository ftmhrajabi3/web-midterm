const usernameInput = document.getElementById("username");
const submitButton = document.querySelector(".submitBttn");
const imgSrcText = document.getElementById("userImage");
const nameText = document.getElementById("name");
const blogText = document.getElementById("blog");
const locationText = document.getElementById("location");
const bioText = document.getElementById("bioSection");
const errorArea = document.getElementById("error");

async function getDataFromServer(e) {
    e.preventDefault();
    let retrivedObj = retriveData();
    if (retrivedObj == null) {
        try {
            let response = await fetch(`https://api.github.com/users/${usernameInput.value}`);
            let jsonObj = await response.json();
            if (response.status == 404) {
                showAlert("Not found", 1);
                return Promise.reject(`Request failed with error ${response.status}`);
            } else if (response.status != 200) {
                showAlert(response.status, -1);
                return Promise.reject(`Request failed with error ${response.status}`);
            }
            saveData(jsonObj);
            showData(jsonObj);
        } catch (e) {
            console.log(e);
        }
    } else {
        showData(retrivedObj);
        showAlert("Data Retrived", 0);
    }
}

function showAlert(message, typeOfMessage) {
    errorArea.style.visibility = "visible";
    if (typeOfMessage == -1)
        errorArea.innerHTML = "Network issue: " + message;
    else
        errorArea.innerHTML = "Result: " + message;
}

function showData(jsonObj) {
    let imgSrc = jsonObj.avatar_url;
    if (imgSrc != null)
        imgSrcText.src = imgSrc;

    let name = jsonObj.name;
    if (name != null)
        nameText.innerHTML = "Name: " + name;
    else
        nameText.innerHTML = "Name: ";

    let blog = jsonObj.blog;
    if (blog != null)
        blogText.innerHTML = "Blog: " + blog;
    else
        blogText.innerHTML = "Blog: ";

    let location = jsonObj.location;
    if (location != null)
        locationText.innerHTML = "Location: " + location;
    else
        locationText.innerHTML = "Location: ";

    let bio = jsonObj.bio;
    if (bio != null)
        bioText.innerHTML = "Bio: " + formatBio(bio);
    else
        bioText.innerHTML = "Bio: ";
}

function saveData(jsonObj) {
    localStorage.setItem(usernameInput.value, JSON.stringify(jsonObj));
    console.log(JSON.stringify(jsonObj));
    showAlert("Data Saved", 0);
}

function retriveData() {
    let userData = localStorage.getItem(usernameInput.value);
    return JSON.parse(userData);
}

function formatBio(bio) {
    return bio.replace("\r\n", "<br />");
}

submitButton.addEventListener('click', getDataFromServer);
