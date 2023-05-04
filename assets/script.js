var APIKey = "74c48057670478a17f27408eb3690c3b"
var inputEl = document.getElementById("inputCity")
var btn = document.getElementById("submit");
var cityListEl = document.getElementById("cityList")
var currentWeatherEl = document.getElementById("currentWeather")
var displayAreaEl = document.getElementById("displayArea")
var cityNames = [];
var uniquecityNames = [];

// call current weather data by using Built-in API request by city name from OpenWeather
function getApi() {
  var cityName = inputEl.value;
  var requestUrl = 'https://api.openweathermap.org/data/2.5/weather?q='+ cityName + '&appid=' + APIKey
  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {

      // alert if cannot find a city
      if(data.cod !== 200){
        alert(data.message)
        return;
      };

      currentWeatherEl.innerHTML = "";

      var currentDate = dayjs.unix(data.dt).format('D/M/YYYY');
      var iconCode = data.weather[0].icon
      // get weather icon URL from OpenWeather
      var iconURL = "https://openweathermap.org/img/wn/" + iconCode + "@2x.png";
      var divEl = document.createElement('div')
      var headerEl = document.createElement('h2')
      var ulEl = document.createElement('ul')
      var tempEl = document.createElement('li')
      var humidityEl = document.createElement('li')
      var windEl = document.createElement('li')
      var iconImgEl = document.createElement('img')

      headerEl.textContent = data.name + " (" + currentDate + ") ";
      tempEl.textContent = 'Temp: '+ data.main.temp + '\xB0F';
      windEl.textContent = 'Wind: '+ data.wind.speed + ' MPH';
      humidityEl.textContent = "Humidity: " + data.main.humidity + '%';
      
      divEl.setAttribute("class", "col-12 col-lg-10 border border-dark mb-3 p-2");
      iconImgEl.setAttribute("src", iconURL)

      currentWeatherEl.appendChild(divEl)
      divEl.appendChild(headerEl)
      divEl.appendChild(ulEl)
      headerEl.appendChild(iconImgEl);
      ulEl.appendChild(tempEl);
      ulEl.appendChild(windEl);
      ulEl.appendChild(humidityEl);    
    });
};

//get 5-day weather forecast
function getDailyApi () {
  var cityName = inputEl.value;
  var Url = 'https://api.openweathermap.org/data/2.5/forecast?q=' + cityName + '&appid=' + APIKey
  fetch(Url)
  .then(function (response) {
    return response.json();     
  })
  .then(function (data) {
    var lists = data.list

    // get the 5 day weather forecast at the time stamp of 00:00:00 for each day
    var fiveDayLists = lists.filter(function(list){
      return list.dt_txt.match("00:00:00")
    });

    // clear the 5-day forecast display area
    displayAreaEl.innerHTML = "";

    // render the 5-day forecast to display area 
    var headerEl = document.createElement("h2")
    displayAreaEl.appendChild(headerEl)
    headerEl.textContent = "5-Day Forecast:"

    for (var i = 0; i < fiveDayLists.length; i++) { 
      var dailyList = fiveDayLists[i];
      var dailyTemp = dailyList.main.temp;
      var dailyDate = dailyList.dt_txt.split(" ")[0]
      var date = dayjs(dailyDate).format('D/M/YYYY');
      var dailyHumidity = dailyList.main.humidity;
      var dailyWind = dailyList.wind.speed
      var dailyIcon = dailyList.weather[0].icon

      // get weather icon URL from OpenWeather
      var dailyIconURL = "https://openweathermap.org/img/wn/" + dailyIcon + "@2x.png";

      var divEl = document.createElement('div')
      var ulEl = document.createElement('ul')
      var dateEl = document.createElement('li')
      var iconEl = document.createElement('li')
      var tempEl = document.createElement('li')
      var humidityEl = document.createElement('li')
      var windEl = document.createElement('li')
      var iconImgEl = document.createElement('img')       

      ulEl.setAttribute("data-index", i);
      divEl.setAttribute("class", "col-12 col-sm-6 col-lg-2 mb-3 p-2");
      ulEl.setAttribute("class","card text-light p-2");
      iconImgEl.setAttribute("src", dailyIconURL)
      dateEl.setAttribute("class", "fw-bold");

      displayAreaEl.appendChild(divEl)
      divEl.appendChild(ulEl)
      ulEl.appendChild(dateEl);
      ulEl.appendChild(iconEl);
      ulEl.appendChild(tempEl);
      ulEl.appendChild(humidityEl);
      ulEl.appendChild(windEl);
      iconEl.appendChild(iconImgEl);

      dateEl.textContent = date;
      tempEl.textContent = "Temp: " + dailyTemp + '\xB0F';
      windEl.textContent = "Wind: " + dailyWind  + ' MPH';
      humidityEl.textContent = "Humidity: " + dailyHumidity + '%';
    };
  });
};

// render city name to city list area
function renderCityNames() {
  cityListEl.innerHTML = "";
  for (var i = 0; i < cityNames.length; i++) {
    var cityName = cityNames[i];
    var liEl = document.createElement("li");
    liEl.textContent = cityName;
    cityListEl.appendChild(liEl);
    liEl.setAttribute("class", "list-group-item list-group-item-action list-group-item-secondary rounded p-2 g-col-6 my-1 text-center");
  };
};

// read city name from local storage
function init () {
  var storedCity = JSON.parse(localStorage.getItem("uniquecityNames"));
  if (storedCity !== null) {
    cityNames = storedCity;
  }
  renderCityNames();
};

// save city name to local storage
function saveCityNames(cityName) {
  if (cityName === "") {
    return;
  };

  //captalized the first letter of each word in the city name
  words = cityName.toLowerCase().split(" ");
  for (let i = 0; i < words.length; i++) {
  words[i] = words[i][0].toUpperCase() + words[i].substr(1);
  };
  var captalizedCityName = words.join(" ").toString();
  cityNames.push(captalizedCityName);

  // get rid of the duplicate city name and store to local storage
  var uniquecityNames = cityNames.filter(function(value,index,array){
    return array.indexOf(value) === index;
  })
  inputEl.value = ""; 
  localStorage.setItem("uniquecityNames", JSON.stringify(uniquecityNames))
};

// Add event listener to previous search city lists
cityListEl.addEventListener("click", function(event) {
  var element = event.target;
  if (element.matches("li") === true) {
    var StoredInput = element.textContent
    inputEl.value = StoredInput
  }
  getApi();
  getDailyApi();
});

//add event listener to the search button
btn.addEventListener('click', function(event){
  event.preventDefault();
  var cityName = inputEl.value.trim();

  // alert if no city name
  if (!cityName){
    alert("Please enter a city name")
    return
  }
  getApi();
  getDailyApi();
  saveCityNames(cityName);
  init()
});

//loading previous search history from local storage when open the page
init();
