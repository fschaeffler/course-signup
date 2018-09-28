const fs = require('fs');
const request = require('request-promise');
const fixtures = require('./students.json');
const config = require('../../course-signup-config/global.json');

fixtures.students.forEach(function (student) {
	var options = {
		method: 'POST',
		url: `https://${config.claudia_app_id}.execute-api.eu-central-1.amazonaws.com/latest/students`,
		json: student
	};

	request(options)
		.then(function (success) { console.log('student ' + student._id + ' imported'); })
		.catch(function (error) {
			console.log('error while importing student ' + student._id);
			console.log(error);
		});
});
