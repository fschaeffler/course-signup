'use strict';

angular.module('courseSignupApp.course-signup', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/course-signup', {
		templateUrl: 'course-signup/course-signup.html',
		controller: 'View1Ctrl'
	});
}])

.controller('View1Ctrl', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {
	$http.get('https://lwynma4spl.execute-api.eu-central-1.amazonaws.com/latest/courses').
		then(function(response) {
			$scope.courses = response.data.sort(function(a, b) {
				return a.name > b.name;
			});
		});

	$scope.signup = function(courseId, matriculationId, birthday) {
		var data = {
			courseId: courseId,
			matriculationId: matriculationId,
			birthday: birthday
		};

		$http.post('https://lwynma4spl.execute-api.eu-central-1.amazonaws.com/latest/signup', data).
			success(function(data) {
				_setMessage($scope, data);
				if (data.status === 'SUCCESS') { $scope.selectedCourse.placesFree--; }
			}).
			error(function(data) {
				_setMessage($scope, data);
			});
	};
}]);

var _setMessage = function (scope, data) {
	(angular.element(document.querySelector('#result'))).html(data.status + ':<br/>' + data.message);

	setTimeout(function () {
		(angular.element(document.querySelector('#result'))).html('&nbsp;');
	}, 3000);
};
