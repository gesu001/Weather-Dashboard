var inputEl = document.getElementById("inputCity")
var btn = document.getElementById("submit");
var APIKey = "74c48057670478a17f27408eb3690c3b"
var cityListEl = document.getElementById("cityList")
var cityNames = [];
var displayAreaEl = document.getElementById("displayArea")

//var today = dayjs().format('YYYY-MM-DD');
//var nextday = dayjs().add(1, "day").format('YYYY-MM-DD');
//console.log(today)
//console.log(nextday)
//console.log(nextday + " 00:00:00")

function getApi() {
  var cityName = inputEl.value;
  var requestUrl = 'https://api.openweathermap.org/data/2.5/weather?q='+ cityName + '&appid=' + APIKey
  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
        console.log(data)
      var iconCode = data.weather[0].icon
      var city = document.getElementById('cityname')
      var currentWeather = document.getElementById('currentWeather')
      var date = dayjs.unix(data.dt).format('YYYY-MM-DD');
      console.log(date)
      var weatherIcon = document.createElement("img");
      var iconURL = "https://openweathermap.org/img/wn/" + iconCode + "@2x.png";
      var cityName = data.name
      city.textContent = cityName + " (" + date + ") "
      console.log(iconURL)
      weatherIcon.setAttribute("src",iconURL)
      city.appendChild(weatherIcon)
      currentWeather.innerText = 'Temp: '+ data.main.temp + '\xB0F'+ '\n' + 'Wind: '+ data.wind.speed + ' MPH' + '\n' + 'Humidity: '+ data.main.humidity + '%'

      cityNames.push(cityName);
      localStorage.setItem("cityNames", JSON.stringify(cityNames))
    
    });
  }

  function getDailyApi () {
    var cityName = inputEl.value;
    var Url = 'https://api.openweathermap.org/data/2.5/forecast?q=' + cityName + '&appid=' + APIKey
    fetch(Url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var lists = data.list

      var headerEl = document.createElement("h2")
      displayAreaEl.appendChild(headerEl)
      headerEl.textContent = "5-Day Forcast:"

      console.log(lists)

      var fiveDayLists = lists.filter(function(list){
        return list.dt_txt.match("00:00:00")

      })
     console.log(fiveDayLists)
     displayAreaEl.innerHTML = "";

      for (var i = 0; i < fiveDayLists.length; i++) { 
        var dailyList = fiveDayLists[i];
        var dailyTemp = dailyList.main.temp;
        var dailyDate = dailyList.dt_txt.split(" ")[0]
        console.log(dailyDate)
        var dailyHumidity = dailyList.main.humidity;
        var dailyWind = dailyList.wind.speed
        var dailyIcon = dailyList.weather[0].icon
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
        divEl.setAttribute("class", "col-12 col-sm-6 col-lg-2 mb-3");
        ulEl.setAttribute("class","card card-1 bg-dark text-light");
        iconImgEl.setAttribute("src", dailyIconURL)

        displayAreaEl.appendChild(divEl)
        divEl.appendChild(ulEl)
        ulEl.appendChild(dateEl);
        ulEl.appendChild(iconEl);
        ulEl.appendChild(tempEl);
        ulEl.appendChild(humidityEl);
        ulEl.appendChild(windEl);
        iconEl.appendChild(iconImgEl);

        dateEl.textContent = dailyDate;
        //iconEl.textContent = dailyIcon;
        tempEl.textContent = "Temp: " + dailyTemp;
        humidityEl.textContent = "Humidity: " + dailyHumidity;
        windEl.textContent = "Wind: " + dailyWind;
        //console.log(iconUrl= 'http://openweathermap.org/img/wn/'+ iconCode +'.png');   
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
    var storedCity = JSON.parse(localStorage.getItem("cityNames"));
    if (storedCity !== null) {
      cityNames = storedCity;
    }
    renderCityNames();
  }

  //function saveCityNames(cityName) {
  //  if (cityName === "") {
   //   return;
   // }
  //  cityNames.push(cityName);
   // inputEl.value = ""; 
   //   localStorage.setItem("cityNames", JSON.stringify(cityNames))
 // }

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
  if (!cityName){
    return}

  getApi();
  getDailyApi();
  //saveCityNames(cityName);
  renderCityNames();
});

init()








