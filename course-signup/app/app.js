'use strict';

// Declare app level module which depends on views, and components
angular.module('courseSignupApp', [
  'ngRoute',
  '720kb.datepicker',
  'courseSignupApp.course-signup'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/course-signup'});
}]);