'use strict';

angular.module('courseSignupApp.course-signup', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/course-signup', {
		templateUrl: 'course-signup/course-signup.html',
		controller: 'View1Ctrl'
	});
}])

.controller('View1Ctrl', function($scope, $http) {
	$http.get('https://vlsdhgc3r0.execute-api.eu-central-1.amazonaws.com/latest/courses').
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

		$http.post('https://vlsdhgc3r0.execute-api.eu-central-1.amazonaws.com/latest/signup', data).
			success(function(data) {
				(angular.element(document.querySelector('#result'))).text(data.status + ': ' + data.message);

				if (data.status === 'SUCCESS') {
					$scope.selectedCourse.placesFree--;
				}
			}).
			error(function(data) {
				(angular.element(document.querySelector('#result'))).text('ERROR: ' + (data && data.errorMessage));
			});
	};
});