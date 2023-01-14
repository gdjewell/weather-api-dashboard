
let listOfCities =  [];
const submitSearch = $('#submitSearch');
const previousSearches = $('#previous-searches')
const todayDate = moment().format('dddd, MMMM Do YYYY, h A');
let cityName;
const cardHolder = $('.card-holder')
const PreviousSearchesButton = $('.previous-search-buttons')
let localData = JSON.parse(localStorage.getItem('City Name'));



if (localData) {
  listOfCities = localData;
  newPreviousSearch();
}




function newPreviousSearch() {
  
  for (i = 0; i < listOfCities.length; i++) {
    let newLi = $('<li>').attr('style', 'list-style-type:none');
    let newPreviousSearchButton = $('<button>').attr('class', 'bg-info btn btn-outline-primary btn-lg previous-search-buttons').attr('style', 'text-decoration:none').text(listOfCities[i])
    previousSearches.append(newLi);
    newLi.append(newPreviousSearchButton);
    newLi.attr({id: 'list-item' + i})
    newPreviousSearchButton.attr({id: 'search' + i})
  }
}

function retrieveWeather(city) {


  const api = "5fa0b79929f283b3d99738b30be8e57e";
  
  let searchURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + api + "&units=imperial"

  fetch(searchURL)
  .then(function (response) {
    
    return response.json();
    
  })
  .then(function (data) {
    
    if (!listOfCities.includes(cityName ) )  { 
      let newLi = $('<li>').attr('style', 'list-style-type:none')
      let newPreviousSearchButton = $('<button>').attr('class', 'bg-info btn btn-outline-primary btn-lg py-2 previous-search-buttons').attr('style', 'text-decoration:none').text(cityName)
      previousSearches.append(newLi);
      newLi.append(newPreviousSearchButton);
    
      
      for (i = 0; i < listOfCities.length; i++) {
        newLi.attr({id: 'list-item' + i})
        newPreviousSearchButton.attr({id: 'search' + i})
      }
    }
  

      const mainContainer = $('.main-container');
      const cityh4 = $('#cityID');
      const currentCondSelect = $('#current-condition');
       mainContainer.removeClass('hide');
      let cityTitle = cityh4.text(data.name)
      const dateToday = $('#dateToday');
      let date = dateToday.text(todayDate)
      latitude = data.coord.lat
      longitude = data.coord.lon
      let currentConditionIcon = data.weather[0].icon;
      const tempMain = $('#tempMain');
      const windMain = $('#windMain')
      const humidityMain = $('#humidityMain');  
      let tempToday = tempMain.text(data.main.temp + "°F") 
      let windToday = windMain.text(data.wind.speed + " Mph")
      let humidity = humidityMain.text(data.main.humidity + "%")
      let iconURL = "http://openweathermap.org/img/wn/" + currentConditionIcon + "@2x.png"

          currentCondSelect.attr('src', iconURL)


      cityh4.append(cityTitle);
      dateToday.append(date);
      tempMain.append(tempToday);
      windMain.append(windToday);
      humidityMain.append(humidity);


    
      let forecastURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + latitude + "&lon=" + longitude + "&appid=" + api + "&units=imperial"

fetch(forecastURL)
  .then(function (response) {
    return response.json();
  })
  .then(function (fiveday) {
    console.log(fiveday)
    cardHolder.empty()

    for (i = 1; i <= 5; i++) {
      let newCol = $('<div>').attr('class', 'col-sm-2 mx-auto').attr({id: (i)});
      let newCard = $('<div>').attr('class', 'card').attr({id: 'cardID' + i});
      let newImage = $('<img>').attr('class', 'card-img-top');
      let forecastDate = $('<h4>')
      let para1 = $('<p>').attr({id: 'temp' + i})
      let para2 = $('<p>').attr({id: 'wind' + i});
      let para3 = $('<p>').attr({id: 'humidity' + i})
      let newDay = [moment().add([i], 'days').format('ll')]
      let conditions = fiveday.list[i].weather[0].icon
      let forecastTemp = fiveday.list[i].main.temp + "°F"
      let forecastWind = fiveday.list[i].wind.speed + "Mph"
      let forecastHumidity = fiveday.list[i].main.humidity + "%"
      let forecastIcon = "http://openweathermap.org/img/wn/" + conditions + "@2x.png"
      newImage.attr('src', forecastIcon)
      console.log(forecastIcon)

      cardHolder.append(newCol);
      newCol.append(newCard);
      newCard.append(forecastDate);
      newCard.append(newImage);
      newCard.append(para1);
      newCard.append(para2);
      newCard.append(para3);
      forecastDate.append(newDay);


      $('#temp' + i).text("Temp: " + forecastTemp)
      $('#wind' + i).text("Wind: " + forecastWind)
      $('#humidity' + i).text("Humidity: " + forecastHumidity)
      
    }
    
    
  }) 

  
  }) 
  .catch(error =>  {
    alert("You've entered an invalid city.")
    console.log(error)
    })

}





submitSearch.on('click', function(e) {
  cityName = $(this).prev().val()
  listOfCities.push(cityName);
  saveCity = localStorage.setItem("City Name", JSON.stringify((listOfCities)));
  console.log(cityName);
  
  if (cityName == "") {
    return
    
  }
  retrieveWeather(cityName);
})

previousSearches.on('click', '.previous-search-buttons', function(e) {
  
  cityName = e.target.innerHTML
  retrieveWeather(cityName)
})

