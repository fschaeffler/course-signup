const fs = require('fs');
const request = require('request-promise');
const fixtures = require('./courses.json');

fixtures.courses.forEach(function (course) {
	var options = {
		method: 'POST',
		url: 'https://lwynma4spl.execute-api.eu-central-1.amazonaws.com/latest/courses',
		json: course
	};

	request(options)
		.then(function (success) { console.log('course ' + course._id + ' imported'); })
		.catch(function (error) {
			console.log('error while importing course ' + course._id);
			console.log(error);
		});
});
