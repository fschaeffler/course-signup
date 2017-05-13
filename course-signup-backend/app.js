var ApiBuilder = require('claudia-api-builder'),
	AWS = require('aws-sdk'),
	api = new ApiBuilder(),
	dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports = api;

api.get('/courses/{id}', function (request) {
	var id, params;

	id = request.pathParams.id;
	params = {
		TableName: request.env.tableName,
		Key: {_id: id}
	};

	return dynamoDb.get(params).promise().then(function (response) {
		return (response && response.Item);
	});
}, {success: 200});

api.get('/courses', function (request) {
	return dynamoDb.scan({TableName: request.env.tableName}).promise().then(function (response) {
		return (response && response.Items);
	});
}, {success: 200});

api.post('/courses', function (request) {
	var params = {
		TableName: request.env.tableName,
		Item: {
			_id: request.body._id,
			name: request.body.name,
			placesMax: request.body.placesMax,
			placesFree: request.body.placesMax
		}
	};

	return dynamoDb.put(params).promise();
}, {success: 201});

api.post('/signup', function (request) {
	var courseId = request && request.body && request.body.courseId;
	var matriculationId = request && request.body && request.body.matriculationId;
	var birthday = request && request.body && request.body.birthday;

	if (!courseId || !matriculationId || !birthday) { throw new Error('SIGNUP.MISSING_PARAMETERS'); }
	else { return _signup(request, courseId, matriculationId, birthday); }
});

var _signup = function (request, courseId, matriculationId, birthday) {
	var studentExits = _checkStudentExists(matriculationId, birthday);
	var studentNotSignedUp = _checkStudentNotSignedUp(courseId, matriculationId);

	if (!studentExits || !studentNotSignedUp) { throw new Error('SIGNUP.UNKNOWN_ERROR'); }
	else if (!_checkCoursePlacesFree(request, courseId)) { throw new Error('SIGNUP.COURSE_FULL'); }
	else {
		return _signupStudentForCourse(request, courseId, matriculationId);
		// return 'SIGNUP.SUCCESS';
	}
};

var _checkStudentExists = function (matriculationId, birthday) {
	// TODO: implement
	var result = true;

	if (!result) { throw new Error('STUDENT.NOT_FOUND'); }
	else { return result; }
};

var _checkStudentNotSignedUp = function (courseId, matriculationId) {
	// TODO: implement
	var result = true;

	if (!result) { throw new Error('SIGNUP.ALREADY_SIGNED_UP'); }
	else { return result; }
};

var _checkCoursePlacesFree = function (request, courseId) {
	params = {
		TableName: request.env.tableName,
		Key: {_id: courseId}
	};

	return dynamoDb.get(params).promise().then(function (response) {
		return (response && response.Item && response.Item.placesFree > 0);
	});	
};

var _signupStudentForCourse = function (request, courseId, matriculationId) {
	params = {
		TableName: request.env.tableName,
		Key: {_id: courseId},
		UpdateExpression: 'ADD placesFree :placesFreeDecrement SET matriculationIds = list_append(if_not_exists(matriculationIds, :empty_list), :matriculationId)',
		ExpressionAttributeValues: {':matriculationId': [matriculationId], ':empty_list': [], ':placesFreeDecrement': -1},
		ReturnValues: 'UPDATED_NEW'
	};

	return dynamoDb.update(params).promise().then(function (response) {
		return response ? 'SIGNUP.SUCCESS' : 'SIGNUP.UNKNOWN_ERROR';
	});
};

api.addPostDeployConfig('tableName', 'DynamoDB Table Name:', 'configure-db');