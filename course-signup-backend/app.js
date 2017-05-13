var ApiBuilder = require('claudia-api-builder'),
api = new ApiBuilder();

module.exports = api;

api.get('/courses', function () {
	return [
		{_id: '3CZWLtB4ZgAqXNB4f', name: 'Course 1', placesMax: 25, placesFree: 25},
		{_id: '3DjZjbzBag69RCxNz', name: 'Course 2', placesMax: 50, placesFree: 48, matriculationIds: [112233, 445566]},
		{_id: 'ARyy9y38BXypKr8ds', name: 'Course 3', placesMax: 100, placesFree: 100},
		{_id: 'jjbqgZFGadZTkm5ac', name: 'Course 4', placesMax: 50, placesFree: 49, matriculationIds: [112233]},
	];
});

api.post('/signup', function (request) {
	var courseId = request && request.body && request.body.courseId;
	var matriculationNumber = request && request.body && request.body.matriculationNumber;
	var birthday = request && request.body && request.body.birthday;

	if (!courseId || !matriculationNumber || !birthday) { throw new Error('SIGNUP.MISSING_PARAMETERS'); }
	else { return _signup(courseId, matriculationNumber, birthday); }
});

var _signup = function (courseId, matriculationNumber, birthday) {
	return 'SIGNUP.SUCCESS';
};
