var inputEl = document.getElementById("inputCity")
var btn = document.getElementById("submit");
var APIKey = "74c48057670478a17f27408eb3690c3b"
var cityListEl = document.getElementById("cityList")
var cityNames = [];

var testEl = document.getElementById('test')


//console.log(dayjs('2023-04-27').unix())

function getApi() {
  var cityName = inputEl.value;
  var requestUrl = 'https://api.openweathermap.org/data/2.5/weather?q='+ cityName + '&appid=74c48057670478a17f27408eb3690c3b'
  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var iconCode = data.weather[0].icon
      //console.log(iconUrl= 'http://openweathermap.org/img/w/'+ iconCode +'.png');

      var city = document.getElementById('cityname')
      var currentWeather = document.getElementById('currentWeather')
      city.textContent = data.name;
      currentWeather.innerText = 'Temp: '+ data.main.temp + '\xB0F'+ '\n' + 'Wind: '+ data.wind.speed + ' MPH' + '\n' + 'Humidity: '+ data.main.humidity + '%'
    });
  }

  function getDailyApi () {
    var cityName = inputEl.value;
    var Url = 'https://api.openweathermap.org/data/2.5/forecast?q=' + cityName + '&cnt=5&appid=74c48057670478a17f27408eb3690c3b'
    fetch(Url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data)
      var lists = data.list

      var headerEl = document.createElement("h2")

      testEl.appendChild(headerEl)

      headerEl.textContent = "5-Day Forcast"
      for (var i = 0; i < lists.length; i++) {
        
        var dailyList = lists[i];
        console.log(dailyList)

        var dailyTemp = dailyList.main.temp;
        console.log(dailyTemp)
        var dailyHumidity = dailyList.main.humidity;
        var dailyWind = dailyList.wind.speed
        var dailyIcon = dailyList.weather[0].icon

        var divEl = document.createElement('div')
        var ulEl = document.createElement('ul')
        var dateEl = document.createElement('li')
        var tempEl = document.createElement('li')
        var humidityEl = document.createElement('li')
        var windEl = document.createElement('li')
        var iconEl = document.createElement('li')

        ulEl.setAttribute("data-index", "i");
        divEl.setAttribute("class", "col-12 col-sm-6 col-lg-2 mb-3");

        ulEl.setAttribute("class","card card-1 bg-dark text-light");

        testEl.appendChild(divEl)
        
        divEl.appendChild(ulEl)

        ulEl.appendChild(dateEl);
        ulEl.appendChild(iconEl);
        ulEl.appendChild(tempEl);
        ulEl.appendChild(humidityEl);
        ulEl.appendChild(windEl);
        

        tempEl.textContent = dailyTemp;
        humidityEl.textContent = dailyHumidity;
        windEl.textContent = dailyWind;
        iconEl.textContent = dailyIcon;
        //console.log(iconUrl= 'http://openweathermap.org/img/w/'+ iconCode +'.png');   
      }
    
    });
  }

  function renderCityNames() {
    cityListEl.innerHTML = "";
    for (var i = 0; i < cityNames.length; i++) {
      var cityName = cityNames[i];
      var li = document.createElement("li");
      var button = document.createElement("button")
      button.textContent = cityName;
      button.setAttribute("data-index", i);  
      li.appendChild(button);
      cityListEl.appendChild(li);
    }
  }

  function init () {
    var storedCitys = JSON.parse(localStorage.getItem("cityNames"));
    if (storedCitys !== null) {
      cityNames = storedCitys;
    }
    renderCityNames();
  }

  function saveCityNames(cityName) {
    if (cityName === "") {
      return;
    }
    cityNames.push(cityName);
    inputEl.value = ""; 
      localStorage.setItem("cityNames", JSON.stringify(cityNames))
  }

// Add click event to cityListEl
cityListEl.addEventListener("click", function(event) {
  var element = event.target;

  // Checks if element is a button
  if (element.matches("button") === true) {
    var StoredInput = element.textContent
    inputEl.value = StoredInput
  }
  getApi();
  getDailyApi();
});


btn.addEventListener('click', function(event){
  event.preventDefault();
  var cityName = inputEl.value.trim();
  getApi();
  getDailyApi();
  saveCityNames(cityName);
  renderCityNames();
});

init()








