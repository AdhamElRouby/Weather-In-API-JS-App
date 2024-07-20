import {inputField, locationBtn, showErrorMsg, searchBtnCallBack, findCurrLocation} from './fetch.js';

// const variables
const searchBtn = document.querySelector('.search-btn');

// event listeners
searchBtn.addEventListener('click', searchBtnCallBack);

inputField.addEventListener('keydown', e => {if(e.key === "Enter") searchBtnCallBack();});

locationBtn.addEventListener('click', () => {
    if(locationBtn.classList.contains('active')) return;
    if (navigator.geolocation) {
        findCurrLocation();
      } else {
        console.error("Geolocation is not supported by this browser.");
        showErrorMsg();
    }
});
