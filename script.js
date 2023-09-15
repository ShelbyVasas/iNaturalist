
const getPlaces = async () => {
    let place = document.getElementById("searchbar").value;
        const response = await fetch(`https://api.inaturalist.org/v1/places/autocomplete?q=${place}`);
        const placeJson = await response.json();
        populateDropDown(placeJson.results);
}   

const populateDropDown = (placesList) => {
    let listOfLocations = document.getElementById('list');
    sessionStorage.setItem("places",JSON.stringify(placesList))
    listOfLocations.innerHTML = '';
    for (index in placesList) {
        let locationName = placesList[index].name;
        let b = document.createElement("button");
        b.innerText = locationName;
        b.classList.add("listItem");
        b.value = placesList[index].ancestor_place_ids;
        listOfLocations.appendChild(b);
        b.onclick = (event) => {
            let button = event.target;
            let buttonValue = button.value;
            getImages( buttonValue.split(","));
        }
    }

}

function search() {
    let listContainer = document.getElementById('list');
    let listItems = document.getElementsByClassName('listItem');
    let input = document.getElementById('searchbar').value
    input = input.toLowerCase(); 
        let noResults = true;
    for (i = 0; i < listItems.length; i++) { 
        if (!listItems[i].innerHTML.toLowerCase().includes(input) || input === "") {
            listItems[i].style.display="none";
            continue;
        }
        else {
            listItems[i].style.display="flex";
            noResults = false; 
        }
    }
    listContainer.style.display = noResults ? "none" : "block";
}

const getImages = async (idList) => {
    const allImages = document.getElementById("images");
    allImages.innerHTML = '';
    for (id in idList) {
        const resp = await fetch(`https://api.inaturalist.org/v1/observations?id=${idList[id]}`)
        let json = await resp.json()

        if((!json.results.length == 0) && (!json.results[0].photos.length == 0)) {
            let name = json.results[0].species_guess;
            let photo = json.results[0].photos[0].url;
            let imageWrapper = document.createElement("div");
            imageWrapper.classList.add("photoWrap")
            let wrapperContent = `<img src="${photo}" /> <p>${name}</p>`;
            imageWrapper.innerHTML = wrapperContent;
            allImages.append(imageWrapper);
        }
        
    }
}