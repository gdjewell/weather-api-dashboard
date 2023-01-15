
let listOfCities =  [];
const submitSearch = $('#submitSearch');
const previousSearches = $('#previous-searches')
const todayDate = moment().format('dddd, MMMM Do YYYY, h A');
let cityName;
const cardHolder = $('.card-holder')
const PreviousSearchesButton = $('.previous-search-buttons')
let localData = JSON.parse(localStorage.getItem('City Name'));


// If there is local data populate  the array listOfCities with what's in local storage, and then run newPreviousSearch for each of the items in the array.

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

//Runs retrieveWeather function with the city name after search button is triggered.

function retrieveWeather(city) {


// connect Weather API to page.

  const api = "5fa0b79929f283b3d99738b30be8e57e";
  
  let searchURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + api + "&units=imperial"

  fetch(searchURL)
  .then(function (response) {
    
    return response.json();
    
  })
  .then(function (data) {

    //If list of cities doesn't includ the city name then create new list item, and button for the previous search.
    
    if (!listOfCities.includes(cityName ) )  { 
      let newLi = $('<li>').attr('style', 'list-style-type:none')
      let newPreviousSearchButton = $('<button>').attr('class', 'bg-info btn btn-outline-primary btn-lg py-2 previous-search-buttons').attr('style', 'text-decoration:none').text(cityName)
      previousSearches.append(newLi);
      newLi.append(newPreviousSearchButton);
    
      //gives each li item and button a unique ID.
      
      for (i = 0; i < listOfCities.length; i++) {
        newLi.attr({id: 'list-item' + i})
        newPreviousSearchButton.attr({id: 'search' + i})
      }
    }
  


      const mainContainer = $('.main-container');
      const cityh4 = $('#cityID');
      const currentCondSelect = $('#current-condition');

      //removes the hide class so the main section shows up.

       mainContainer.removeClass('hide');
      let cityTitle = cityh4.text(data.name)
      const dateToday = $('#dateToday');
      let date = dateToday.text(todayDate)
      
      // get latitude and longitude from API

      latitude = data.coord.lat
      longitude = data.coord.lon

      // get current condition image from API

      let currentConditionIcon = data.weather[0].icon;
      const tempMain = $('#tempMain');
      const windMain = $('#windMain')
      const humidityMain = $('#humidityMain');  

      // retrieve temp, wind, and humidity data from API

      let tempToday = tempMain.text(data.main.temp + "°F") 
      let windToday = windMain.text(data.wind.speed + " Mph")
      let humidity = humidityMain.text(data.main.humidity + "%")

      //append API image to the image URL

      let iconURL = "http://openweathermap.org/img/wn/" + currentConditionIcon + "@2x.png"

      //add image URL to the right selector

          currentCondSelect.attr('src', iconURL)


          //append each of those items to the DOM.

      cityh4.append(cityTitle);
      dateToday.append(date);
      tempMain.append(tempToday);
      windMain.append(windToday);
      humidityMain.append(humidity);


      //URL to retrieve 5 day forecast.
    
      let forecastURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + latitude + "&lon=" + longitude + "&appid=" + api + "&units=imperial"

fetch(forecastURL)
  .then(function (response) {
    return response.json();
  })
  .then(function (fiveday) {
    console.log(fiveday)

    //clears out cardholder container if something else is searched.

    cardHolder.empty()

    for (i = 1; i <= 5; i++) {

      // create 5 new columns, cards, images, an h4, and  multiple paragraphs for each of the elements in the forecast.

      let newCol = $('<div>').attr('class', 'col-sm-2 mx-auto').attr({id: (i)});
      let newCard = $('<div>').attr('class', 'card').attr({id: 'cardID' + i});
      let newImage = $('<img>').attr('class', 'card-img-top');
      let forecastDate = $('<h4>')
      let para1 = $('<p>').attr({id: 'temp' + i})
      let para2 = $('<p>').attr({id: 'wind' + i});
      let para3 = $('<p>').attr({id: 'humidity' + i})

      // Adds a new day for each of the five day forecast.

      let newDay = [moment().add([i], 'days').format('ll')]

      // retrieves forecast images, temps, wind speed, and humidity for each of the five days.

      let conditions = fiveday.list[i].weather[0].icon
      let forecastTemp = fiveday.list[i].main.temp + "°F"
      let forecastWind = fiveday.list[i].wind.speed + "Mph"
      let forecastHumidity = fiveday.list[i].main.humidity + "%"
      let forecastIcon = "http://openweathermap.org/img/wn/" + conditions + "@2x.png"
      newImage.attr('src', forecastIcon)
      console.log(forecastIcon)

      //appends all items to the DOM.

      cardHolder.append(newCol);
      newCol.append(newCard);
      newCard.append(forecastDate);
      newCard.append(newImage);
      newCard.append(para1);
      newCard.append(para2);
      newCard.append(para3);
      forecastDate.append(newDay);

      // adds appropriate text to each of the paragraphs within the cards.

      $('#temp' + i).text("Temp: " + forecastTemp)
      $('#wind' + i).text("Wind: " + forecastWind)
      $('#humidity' + i).text("Humidity: " + forecastHumidity)
      
    }
    
    
  }) 

  
  }) 

  // if any errors appear let the user know via alert.

  .catch(error =>  {
    alert("You've entered an invalid city.")
    console.log(error)
    })

}



// if submit button is clicked store cityName that was entered, push it to list of cities, store it in local storage, and cancel if nothing was entered. Finally, run retrieve weather function

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

//if previous search was selected use the contents of the text in the button to the cityName.

previousSearches.on('click', '.previous-search-buttons', function(e) {
  
  cityName = e.target.innerHTML
  retrieveWeather(cityName)
})

