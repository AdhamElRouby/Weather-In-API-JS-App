// const variables
const APIKey = "635582e562de5ed972cb926213820824";
const container = document.querySelector('.container');
export const inputField = document.querySelector('.search-bar input');
export const locationBtn = document.querySelector('.location-btn');
const weatherContainer = document.querySelector('.weather-container');
const errorContainer = document.querySelector('.error-container');
const loadContainer = document.querySelector('.load-container');

// variables

// functions

/**
 * show weather data on website
 * @param {object} data - weather api data
*/
const showWeatherData = data => {
    loadContainer.style.display = 'none';
    errorContainer.style.display = 'none';
    errorContainer.classList.remove('fade-in');
    
    const {main:{temp,humidity}, weather:[{main:status, description}], wind:{speed}} = data;
    
    const imgStatus = document.querySelector('.weather-container img'),
    temperature = document.querySelector('.temperature'),
    descContainer = document.querySelector('.status'),
    humidityContainer = document.querySelector('.humidity .info-number'),
    windContainer = document.querySelector('.wind-speed .info-number');
        
    imgStatus.src = `img/${status}.png`;
    temperature.innerHTML = `${(temp-273.15).toFixed(1)}<span>°C</span>`
    descContainer.textContent = description;
    humidityContainer.textContent = `${humidity}%`;
    windContainer.textContent = `${(speed*3.6).toFixed(1)}Km/h`
    
    container.classList.remove('error-active');
    container.classList.add('active');
    weatherContainer.style.display = 'block';
    weatherContainer.classList.add('fade-in');
};

/**
 * display error message on website
 * @param {bool} locationError - whether the call of the function is due to inability to locate the user
*/
export const showErrorMsg = (locationError = false) => {
    // hide the current containers
    loadContainer.style.display = 'none';
    weatherContainer.style.display = 'none';
    weatherContainer.classList.remove('fade-in');
    // show error container
    if(locationError) inputField.value = "";
    container.classList.remove('active');
    container.classList.add('error-active');
    errorContainer.style.display = 'block';
    errorContainer.classList.add('fade-in');
};

/**
 * fetch weather data using city name
 * @param {string} city - city name
*/
const fetchCity = async city => {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}`;

    try {
        
        if(container.classList.contains('active')) {
            weatherContainer.style.display = 'none';
            loadContainer.style.display = 'flex';   
        }

        const res = await fetch(url);
        if(!res.ok) {
            throw new Error("location not found");
        }
        
        const data = await res.json();
        showWeatherData(data);

    } catch(err) {
        console.error(err);
        showErrorMsg();
    }
};

export const searchBtnCallBack = () => {
    const city = inputField.value;
    if(!city) return;
    locationBtn.classList.remove('active');
    fetchCity(city);
}

/**
 * fetch location using latitude and longitude of current location
 * @param {string} url - url to be fetched
*/
const fetchLocation = async url => {
    try {
        const res = await fetch(url);
        if(!res.ok) {
            throw new Error("could not find your location");
        }
        const data = await res.json();
        const [{name:city}] = data;
        inputField.value = city;
        locationBtn.classList.add('active');
        fetchCity(city);
    } catch(err) {
        console.error(err);
        showErrorMsg(true);
    }
}

export const findCurrLocation = () => {
    inputField.value = 'Loading...';
    container.classList.remove('error-active');
    container.classList.add('active');
    weatherContainer.style.display = 'none';
    errorContainer.style.display = 'none';
    loadContainer.style.display = 'flex';   
    navigator.geolocation.getCurrentPosition(async position => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&appid=${APIKey}`;       
        fetchLocation(url);
    }, () => {
        showErrorMsg(true);
    });
}