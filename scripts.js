
// fetching important elements form HTML  document
const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");


// initially needed variables
let currentTab = userTab;
const API_KEY = "d84d9b17bc35773377f2ed06d7f311b7";

currentTab.classList.add("current-tab");

getfromSessionStorage();

// switching tab by event listener

function switchTab(clickedTab){

    if(clickedTab != currentTab){

        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");


        if(!searchForm.classList.contains("active")){
            // if search form container is invisible then make it visible
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        
        }
        else{
            // if on you are on search tab, have to make your weather tab visible
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");

            // now you are in your weather tab, have to display weather, so let's check local storage first for  coordinates, if we have saved there.
            getfromSessionStorage();  
        }


    }

}


userTab.addEventListener("click", ()=>{
    // pass the clicked tab as input parameter
    switchTab(userTab);
});
searchTab.addEventListener("click", ()=>{
    // pass the clicked tab as input parameter
    switchTab(searchTab);
});





// check if coordinates already present in session storage
function getfromSessionStorage(){

    const localCoordinates = sessionStorage.getItem("user-coordinates");

    if(!localCoordinates){
        // if local coordinates  not present
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }

}

// 
async function fetchUserWeatherInfo(coordinates){
    const {lat, lon} = coordinates;
    // make grant container invisible
    grantAccessContainer.classList.remove("active");
    // make loader visible
    loadingScreen.classList.add("active");

    // call API
    try{

        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);

        const data =await response.json();

        // remove loader screen
        loadingScreen.classList.remove("active");
        // display user weather info screen
        userInfoContainer.classList.add("active");

        // render the  weather info on the UI
        renderWeatherInfo(data);
    }
    catch(e){
        loadingScreen.classList.remove("active");
        
    }
}

// render function
function renderWeatherInfo(weatherInfo){
    // firstly we have to fetch the elements to render info to the UI

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const clouds = document.querySelector("[data-cloudiness]");

    // fetch values from weather info object and put it into UI elements
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText =  weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    clouds.innerText = `${weatherInfo?.clouds?.all}%`;

}


function getLocation(position){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert("GeoLocation support not available");
    }
}

function showPosition(position){
    const userCoordinates ={
        lat : position.coords.latitude,
        lon : position.coords.longitude
    }
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);


let searchInput = document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit", (e) =>{
    e.preventDefault();
    if(searchInput.value ==="")     
        return;
    else
        fetchSearchWeatherInfo(searchInput.value);
     
});

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`);
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(e){

    }
}

