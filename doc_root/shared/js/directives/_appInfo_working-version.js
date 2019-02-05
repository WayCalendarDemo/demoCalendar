app.directive("calendar", function() {
		return {
				restrict: "E",
				templateUrl: "/shared/js/directives/calendar.html",
				scope: {
						selected: "="
				},
				link: function(scope) {
						// Set a starting value for the selected day, based on whether or not
						// the controller's day is set yet. If it isn't, we just use today's date.
						// scope.selected = _removeTime(scope.selected || moment());
						// My Change: Date selected to always start as today's date.
						scope.selected = moment();
						scope.month = scope.selected.clone();
						// Here is were we can create variables for use in html
						scope.today = moment();
						scope.previousMonth = moment().subtract(1, 'month');
						scope.nextMonth = moment().add(1, 'month');

						moment.locale('ja');

						var start = scope.selected.clone();
						start.date(1);
						_removeTime(start.day(0));

						_buildMonth(scope, start, scope.month);

						scope.select = function(day) {
								scope.selected = day.date;
						};

						scope.next = function() {
								var next = scope.month.clone();
								_removeTime(next.month(next.month()+1).date(1));
								scope.month.month(scope.month.month()+1);
								_buildMonth(scope, next, scope.month);
						};

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

		// This function creates the weeks by setting a list of days on the scope.
		function _buildWeek(date, month) {
				var days = [];
				var test = new Date("2019-01-01");
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

		function _isHoliday(date) {
			var isHoliday = JapaneseHolidays.isHoliday(date);
			if (isHoliday) {
				return isHoliday;
			} else {
				return false;
			}
		}

});
