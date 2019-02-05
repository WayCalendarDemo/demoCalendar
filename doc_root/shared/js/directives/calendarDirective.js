// Only controls everything inside calendar.html
app.directive("calendar", function() {
		return {
				restrict: "E",
				templateUrl: "/shared/js/directives/calendar.html",
				scope: {
						selected: "="
				},
				link: function(scope) {

					// 今日の日付を得る - Get today's date
					scope.today = moment();
					// monthの変数を作成し、今日の日付に設定する - Create a month variable and set it to equal the today variable
					scope.month = scope.today.clone();
					/*********************************************
					月を作るための始まりポイントの作成
					この定数は_buildWeekと_buildMonthで使われます。
					Create the starting point for the month
					This variable will be used in functions: _buildWeek and _buildMonth
					*********************************************/
					// 1. startを今日の日付にする
					var start = scope.today.clone();
					// console.log(start);
					// 2. startを当月の1日に変更する
					start.date(1);
					// console.log(start);
					// 3. startをと週の日曜日にする（例：１日は火曜日だったら、当週の日曜日に変更する
					// その上に時間を当日の夜の12:00に設定する
					_removeTime(start.day(1));
					// console.log(start);

					// 当月または選ばれた月の作成
					_buildMonth(scope, start, scope.month);

////////////////////////////////////////////////////////////////////////

					scope.selected = moment();

					scope.showHoliday = function(day) {
						var holidayName = _isHoliday(day.date._d);

						if(holidayName) {
							console.log(holidayName);
							scope.selected = holidayName;
							
						} else {
							console.log('no!');
						}

					};

////////////////////////////////////////////////////////////////////////

					// Set month to next month
					scope.next = function() {
							var next = scope.month.clone();
							_removeTime(next.month(next.month()+1).date(1));
							scope.month.month(scope.month.month()+1);
							_buildMonth(scope, next, scope.month);
					};

					// Set month to previous month
					scope.previous = function() {
							var previous = scope.month.clone();
							_removeTime(previous.month(previous.month()-1).date(1));
							scope.month.month(scope.month.month()-1);
							_buildMonth(scope, previous, scope.month);
					};

					// My function reset to current month.
					scope.current = function () {
						console.log("current");
						var start = scope.selected.clone();
						start.date(1);
						_removeTime(start.day(0));
						scope.month = moment();
						_buildMonth(scope, start, scope.month);
					}


						// Set a starting value for the selected day, based on whether or not
						// the controller's day is set yet. If it isn't, we just use today's date.
						// scope.selected = _removeTime(scope.selected || moment());
						// My Change: Date selected to always start as today's date.
						// scope.selected = moment();
						// scope.month = scope.selected.clone();
						// Here is were we can create variables for use in html
						// scope.today = moment();
						// scope.previousMonth = moment().subtract(1, 'month');
						// scope.nextMonth = moment().add(1, 'month');

						// moment.locale('ja');
				}
		};

		// Sets the time to the current date at midnight.
		function _removeTime(date) {
				return date.day(0).hour(0).minute(0).second(0).millisecond(0);
		}

		// This function creates the months by setting a list of weeks on the scope.
		function _buildMonth(scope, start, month) {
				scope.weeks = [];
				var done = false, date = start.clone(), monthIndex = date.month(), count = 0;
				while (!done) {
						scope.weeks.push({ days: _buildWeek(date.clone(), month) });
						date.add(1, "w");
						done = count++ > 2 && monthIndex !== date.month();
						monthIndex = date.month();
				}
		}
		// 説明:
		//

		// This function creates the weeks by setting a list of days on the scope.
		function _buildWeek(date, month) {
				var days = [];
				for (var i = 0; i < 7; i++) {
						days.push({
								name: date.format("dd").substring(0, 1),
								number: date.date(),
								isCurrentMonth: date.month() === month.month(),
								isToday: date.isSame(new Date(), "day"),
								date: date,
								isHoliday: _isHoliday(date._d)
						});
						date = date.clone();
						date.add(1, "d");
				}
				return days;
		}
		// 説明：
		//

		function _isHoliday(date) {
			var isHoliday = JapaneseHolidays.isHoliday(date);
			if (isHoliday) {
				return isHoliday;
			} else {
				return false;
			}
		}

});
