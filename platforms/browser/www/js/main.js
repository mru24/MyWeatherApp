
var cityInput = $('#cityInput');
var citySelect = $('#citySelect');

var oneCallApi = 'https://api.openweathermap.org/data/2.5/onecall?';

$('#get-result').on('click', function() {
  loadApi(oneCallApi);
});
$('#clear-input').on('click', function() {
  $(cityInput).val('');
});
$('#home').on('click', function() {
  $(cityInput).val('My Location');
});
$('#search').on('click', function() {
  $('#myForm').slideDown();
})

$(document).ready(function() {
  currentTime();
});


function loadApi(api_data) {
  console.log(api_data);
  var api = api_data;
  var units = '&units=metric';
  var apiKey = '&id=524901&APPID=055f1d666fd988c72b7af102a40c00a8';
  var city = $(cityInput).val();
  if(city == "My Location") {
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition( function(position) {
        var lat = position.coords.latitude;
        var lon = position.coords.longitude;
        var url = api + "lat=" + lat + "&lon=" + lon + units + apiKey;
        getData(url);
      });
    } else {
      alert("No geo location");
    }
  } else {
    var pos = $(cityInput).attr('data-pos');
    var url = api + pos + units + apiKey;
    getData(url);
  }

  function getData(url) {
    console.log(url);
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onload = function() {
      if(this.status == 200) {
        var weather = JSON.parse(this.responseText);
        console.log("Current weather", weather.current);
        console.log("Daily weather", weather.daily);
        console.log("Hourly weather", weather.hourly);
        var current = weather.current;
        var current_output = "";
        current_output +=
        '<div class="weather-current">' +
          '<h4>' + city + '</h4>' +
          '<div class="left">' +
            '<img src="https://openweathermap.org/img/w/' + current.weather[0].icon + '.png" />' +
            '<p class="descr">' + current.weather[0].description + '</p>' +
          '</div>' +
          '<div class="right">' +
            '<p class="temp">' + Math.round(current.temp) + ' &#8451;</p>' +
            '<p class="feels_like">feels like <span>' + Math.round(current.feels_like) + ' &#8451;</span></p>' +
            '<p class="wind-speed">wind <span>' + current.wind_speed + ' m/s</span></p>' +
          '</div>' +
        '</div>';
        var sunrise = current.sunrise * 1000;
        var sunset = current.sunset * 1000;
        var sunrise_time = new Date(sunrise);
        var sunrise_hour = sunrise_time.getHours();
        var sunset_time = new Date(sunset);
        var sunset_hour = sunset_time.getHours();
        var hourly_weather = weather.hourly;
        var hourly_output = "";
        hourly_output += "<ul>";
        hourly_weather.forEach((item) => {
          var hour = item.dt * 1000;
          var dt = new Date(hour);
          var dt_hour = dt.getHours();
          var dt_min = dt.getMinutes();
          hourly_output +=
          '<li class="time">' + dt_hour + ':' + getRightNumber(dt_min) + '</li>';
          if(dt_hour > sunrise_hour - 2 && dt_hour <= sunrise_hour - 1) {
            console.log("1",dt_hour,"/",sunrise_hour,"/",sunset_hour);
            hourly_output +=
            '<div class="weather-hourly" style="background:#111d5d;color:white;">';
          } else if(dt_hour > sunrise_hour - 1 && dt_hour < sunrise_hour + 1) {
            console.log("2",dt_hour,"/",sunrise_hour,"/",sunset_hour);
            hourly_output +=
            '<div class="weather-hourly" style="background:#1047a3;color:white;">';
          } else if(dt_hour > sunrise_hour && dt_hour < sunset_hour -1) {
            console.log("3",dt_hour,"/",sunrise_hour,"/",sunset_hour);
            hourly_output +=
            '<div class="weather-hourly" style="background:#fefefe;color:black;">';
          } else if(dt_hour >= sunset_hour - 1 && dt_hour < sunset_hour) {
            console.log("4",dt_hour,"/",sunrise_hour,"/",sunset_hour);
            hourly_output +=
            '<div class="weather-hourly" style="background:#e4ae21;color:black;">';
          } else if(dt_hour >= sunset_hour && dt_hour < sunset_hour + 1) {
            console.log("5",dt_hour,"/",sunrise_hour,"/",sunset_hour);
            hourly_output +=
            '<div class="weather-hourly" style="background:#1350da;color:white;">';
          } else if(dt_hour >= sunset_hour + 1 && dt_hour < sunset_hour + 2) {
            console.log("6",dt_hour,"/",sunrise_hour,"/",sunset_hour);
            hourly_output +=
            '<div class="weather-hourly" style="background:#153c94;color:white;">';
          } else {
            console.log("7",dt_hour,"/",sunrise_hour,"/",sunset_hour);
            hourly_output +=
            '<div class="weather-hourly" style="background:#090934;color:white;">';
          };
            hourly_output +=
            '<li class="left">' +
              '<ul>' +
                '<li class="temp"><img src="https://openweathermap.org/img/w/' + item.weather[0].icon + '.png" /></li>' +
                '<li>Feels like: </li>' +
                '<li>Pressure: </li>' +
                '<li>Humidity: </li>' +
                '<li>Wind speed: </li>' +
                '<li>Visibility: </li>' +
              '</ul>' +
            '</li>' +
            '<li class="right">' +
              '<ul>' +
                '<li class="temp">' + Math.round(item.temp) + ' &#8451;</li>' +
                '<li>' + Math.round(item.feels_like) + ' &#8451;</li>' +
                '<li>' + item.pressure + ' hPa</li>' +
                '<li>' + item.humidity + ' %</li>' +
                '<li>' + item.wind_speed + ' m/s</li>' +
                '<li>' + item.visibility / 1000 + ' km</li>' +
              '</ul>' +
            '</li>' +
          '</div>';
        });
        hourly_output += "</ul>";



        var daily = weather.daily;

        var daily_output = "";
        daily_output += '<div class="weather-daily">';

        daily.forEach(function(item) {
          var date_day = item.dt * 1000;
          var sunrise = item.sunrise * 1000;
          var sunset = item.sunset * 1000;
          var sunrise_time = new Date(sunrise);
          var sunrise_hour = sunrise_time.getHours();
          var sunrise_min = sunrise_time.getMinutes();
          var sunset_time = new Date(sunset);
          var sunset_hour = sunset_time.getHours();
          var sunset_min = sunset_time.getMinutes();
          var sunset = item.sunset * 1000;
          var date = new Date(date_day);
          var day = date.getDate();
          var month = date.getMonth();
          var year = date.getFullYear();
          var weekday = date.getDay();
          var wd_name;
          switch (weekday) {
            case 1:
              wd_name = "Monday";
              break;
            case 2:
              wd_name = "Tuesday";
              break;
            case 3:
              wd_name = "Wednesday";
              break;
            case 4:
              wd_name = "Thursday";
              break;
            case 5:
              wd_name = "Friday";
              break;
            case 6:
              wd_name = "Saturday";
              break;
            default:
              wd_name = "Sunday";
          };
          daily_output +=
          '<div class="single-day">' +
            '<div class="day">' +
              '<h2>' + wd_name + '</h2>' +
              '<span>' + day + ' / ' + month + ' / ' + year + '</span>' +
            '</div>';
          item.weather.forEach(function(detail) {
            daily_output +=
            '<div class="main-description">' +
              '<div class="icon">' +
                '<img src="https://openweathermap.org/img/w/' + detail.icon + '.png">' +
                '<span class="descr">' + detail.description + '</span>' +
              '</div>' +
            '</div>';
          });
          daily_output +=
            '<div class="content">' +
              '<div class="left">' +
                '<ul>' +
                  '<li>Sunrise: ' + sunrise_hour + ':' + getRightNumber(sunrise_min) + '</li>' +
                  '<li class="temp">' +
                    '<ul>' +
                      '<div class="single-with-image"><img src="https://openweathermap.org/img/w/01d.png"></div>' +
                      '<div class="single-with-image"><img src="https://openweathermap.org/img/w/01n.png"></div>' +
                    '</ul>' +
                  '</li>' +
                  '<li>Humidity: </li>' +
                  '<li>UV: </li>' +
                  '<li>Pressure: </li>' +
                  '<li>Wind speed: </li>' +
                  '<li><div class="single-with-image"><img src="https://openweathermap.org/img/w/10d.png"></div></li>' +
                '</ul>' +
              '</div>' +
              '<div class="right">' +
                '<ul>' +
                  '<li>Sunset: ' + sunset_hour + ':' + getRightNumber(sunset_min) + '</li>' +
                  '<li class="temp">' +
                    '<ul>' +
                      '<div class="single-with-image">' + Math.round(item.temp.day) + ' &#8451;</div>' +
                      '<div class="single-with-image">' + Math.round(item.temp.night) + ' &#8451;</div>' +
                    '</ul>' +
                  '</li>' +
                  '<li>' + item.humidity + ' %</li>' +
                  '<li>' + item.uvi + ' UV</li>' +
                  '<li>' + item.pressure + ' hPa</li>' +
                  '<li>' + item.wind_speed + ' m/s</li>';
                  if(item.rain) {
                    daily_output +=
                    '<li><div class="single-with-image">' + item.rain + ' mm</div></li>';
                  } else {
                    daily_output +=
                    '<li><div class="single-with-image">no data</div></li>';
                  }
                daily_output +=
                '</ul>' +
              '</div>' +
            '</div>' +
          '</div>';
        });
        daily_output += '</div>';

        $(cityInput).val('');
        $('.trigger').slideDown();
        $('#hourly').html(hourly_output);
        $('#current').html(current_output);
        $('#daily').html(daily_output);
      }
    }
    xhr.send();
  }
}

function msToTime(s) {
  var date = new Date(s);
  var time = date.toString();
  return time;
}

var cities = null;
let timeout = null;

$(cityInput).on('keyup', function (e) {
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      var cityInputValue = $(cityInput).val();
      var url = 'https://wft-geo-db.p.rapidapi.com/v1/geo/cities?limit=5&offset=0&namePrefix=' + cityInputValue;
      getCities(url);
    }, 1000);
});

function getCities(url) {
  console.log(url);
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  xhr.open('GET', url, true);
  xhr.setRequestHeader("x-rapidapi-host", "wft-geo-db.p.rapidapi.com");
  xhr.setRequestHeader("x-rapidapi-key", "HKP9rW7tTJmshUm3B1kP4v295hW6p1oQqAejsnn8VzdwXnnmYg");

  xhr.onload = function() {
    if(this.status == 200) {
      var output = '';
      var cities = JSON.parse(this.responseText);
      console.log(cities);
      output += '<li data="My Location">My Location</li>';
      for(i = 0; i < cities.data.length; i++) {
        output += '<li data=' + "lat="+cities.data[i].latitude + "&lon=" + cities.data[i].longitude +'>' + cities.data[i].name + ", " + cities.data[i].regionCode + ", " + cities.data[i].countryCode + '</li>';
      }
    }
    $(citySelect).html(output);
    $(citySelect).slideDown();
  }
  xhr.send();
}
$(citySelect).click(function() {
  $(this).find('li').each(function() {
    $(this).on('click', function() {
      $(this).focus();
      $(cityInput).val($(this).html());
      $(cityInput).attr("data-pos", $(this).attr('data'))
      $(citySelect).html('');
      $(citySelect).slideUp();
    });
  })
});

function currentTime() {
  var d = new Date();
  var time = document.querySelector('#time');
  time.innerHTML = d.getHours() +
  " : " + getRightNumber(d.getMinutes()) +
  " : " + getRightNumber(d.getSeconds()) + "<br /><span class='date'>" +
  d.getDate() +
  " / " + d.getMonth() +
  " / " + d.getFullYear() + "</span>";
  var timer = setTimeout(currentTime,1000);
}
function getRightNumber(i) {
  if(i < 10) {
    i = "0" + i;
  }
  return i;
};

$('#hourly-trigger').on('click', function() {
  $('#hourly').slideToggle();
});
$('#daily-trigger').on('click', function() {
  $('#daily').slideToggle();
});
