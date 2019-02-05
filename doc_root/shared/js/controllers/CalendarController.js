// Controls All within CalendarMain
app.controller("calendarMain", function($scope, $http) {

		// Setting the day variable the calendar sends its selected day to.
		$scope.today = moment();
		$scope.day = moment();

		// Get weather
		var url = 'http://api.openweathermap.org/data/2.5/forecast?lat=34.7044&lon=135.5019&id=1853909&appid=7e0b6dc82fccb55e2bc8bf82a90b8e48&units=metric';
		// var url = 'https://api.darksky.net/forecast/647d4a1f9dae215bb292a0a6b34276a4/34.7044,135.5019?exclude=minutely,hourly,alerts,flags'
		// var url = 'https://map.yahooapis.jp/weather/V1/place?coordinates=139.732293,35.663613&appid=dj00aiZpPUo3QUxwNHRnTTNSUiZzPWNvbnN1bWVyc2VjcmV0Jng9MTA-&output';
		$http({
			 method: 'GET',
			 url: url
		}).then(function (response){
			var allData = response;
			var weatherToday = response.data.list[0].weather[0].main;
			var weatherTodayID = response.data.list[0].weather[0].id;
			var tempToday = Math.floor(response.data.list[0].main.temp);
			var highTempToday = Math.floor(response.data.list[0].main.temp_max);
			var lowTempToday = Math.floor(response.data.list[0].main.temp_min);
			var forecastData = _getForecast(response);;
			var weatherTomorrow = _getWeather(forecastData[0].weather_id);
			var weatherDayAfterTomorrow = _getWeather(forecastData[1].weather_id);

			console.log(forecastData);

			$scope.weather = _getWeather(weatherTodayID);
			$scope.temp = tempToday;
			$scope.tempMax = highTempToday;
			$scope.tempMin = lowTempToday;
			$scope.weatherTomorrow = weatherTomorrow;
			$scope. weatherDayAfterTomorrow = weatherDayAfterTomorrow;
			// console.log("The response");
			// console.log(response);

			return response;
		},function (error){
			console.log("The error");
			console.log(error);
			return error;
		});

		function _getWeather (weatherID) {
			var id = weatherID;
			var weather;
			var weatherName;

			switch(true) {
				case (id >= 801):
					weather="Cloudy";
					break;
				case (id >= 800):
					weather="Clear"
					break;
				case (id >= 701):
					weather="Disaster"
					break;
				case (id >= 600):
					weather="Snowy"
					break;
				case (id >= 500):
					weather="Rainy"
					break;
				case (id >= 300):
					weather="Drizzly"
					break;
				case (id >= 200):
					weather="Thunderstorms"
					break;
				default:
					weather="?"
			}
			console.log('The weather is ' + weather);
			return weather;
		}
		// End get weather

		// get Japanese day
		$scope.japaneseDay = _japaneseDay(moment().format('dddd'));


		function _getForecast(data, select) {
			var allData = data.data.list;
			var dataLength = allData.length;
			var dates = [
				moment().add(1, 'days').format("YYYY-MM-DD"),
				moment().add(2, 'days').format("YYYY-MM-DD")
			]
			var weatherArray = [];

			for (var i = 0; i < dates.length; i++) {
				var currentDate = dates[i];

				for (var j = 0; j < allData.length; j++) {
					var parsedDate = data.data.list[j].dt_txt;
					var setTime = '12:00:00'

					if( parsedDate.indexOf(currentDate) !== -1 && parsedDate.indexOf(setTime) !== -1 ) {
						weatherArray.push(
							{
								dt_txt : data.data.list[j].dt_txt,
								weather_id : data.data.list[j].weather[0].id,
								temp : data.data.list[j].main.temp,
								temp_min : data.data.list[j].main.temp_min,
								temp_max : data.data.list[j].main.temp_max,
							}
						);
					}
				}
			}
			// console.log('weatherarray output is');
			// console.log(weatherArray);
			return weatherArray;
		}

		function _prepareDate(date) {
			var dateStripTime = date.replace(/ .*/,''); //
			// var dateDayNumber = dateStripTime.substring(8);
			// var preparedDate = parseInt(dateDayNumber);
			var preparedDate = dateStripTime;
			return preparedDate;
		}

		function _japaneseDay(day) {
			var englishDay = day;
			var japaneseDay;

			switch(day) {
				case 'Sunday':
					japaneseDay = '日'
					break;
				case 'Monday':
					japaneseDay = '月'
					break;
				case 'Tuesday':
					japaneseDay = '火'
					break;
				case 'Wednesday':
					japaneseDay = '水'
					break;
				case 'Thursday':
					japaneseDay = '木'
					break;
				case 'Friday':
					japaneseDay = '金'
					break;
				case 'Saturday':
					japaneseDay = '土'
					break;
				default:
					japaneseDay = englishDay
			}
			return japaneseDay;
		}

});
