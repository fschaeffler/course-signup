var ApiBuilder = require('claudia-api-builder'),
	AWS = require('aws-sdk'),
	api = new ApiBuilder(),
	dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports = api;

api.get('/courses/{id}', function (request) {
	var id, params;

	id = request.pathParams.id;
	params = {
		TableName: request.env.tableNameCourses,
		Key: {_id: id}
	};

	return dynamoDb.get(params).promise().then(function (response) {
		return (response && response.Item);
	});
}, {success: 200});

api.get('/courses', function (request) {
	return dynamoDb.scan({TableName: request.env.tableNameCourses}).promise()
		.then(function (response) {
			return (response && response.Items);
		});
}, {success: 200});

api.post('/courses', function (request) {
	var params = {
		TableName: request.env.tableNameCourses,
		Item: {
			_id: request.body._id,
			name: request.body.name,
			placesMax: request.body.placesMax,
			placesFree: request.body.placesMax
		}
	};

	return dynamoDb.put(params).promise();
}, {success: 201});

api.post('/students', function (request) {
	var params = {
		TableName: request.env.tableNameStudents,
		Item: {
			_id: request.body._id,
			name: request.body.name,
			matriculationId: request.body.matriculationId,
			birthday: request.body.birthday,
			email: request.body.email
		}
	};

	return dynamoDb.put(params).promise();
}, {success: 201});

api.post('/signup', function (request) {
	var courseId = request && request.body && request.body.courseId;
	var matriculationId = request && request.body && request.body.matriculationId;
	var birthday = request && request.body && request.body.birthday;
	var isValidRequest = (courseId && matriculationId && birthday);

	if (!isValidRequest) { return _getErrorResponse('SIGNUP.MISSING_PARAMETERS'); }
	else { return _signup(request, courseId, matriculationId, birthday); }
});

var _signup = function (request, courseId, matriculationId, birthday) {
	return _checkStudent(request, matriculationId, birthday)
		.then(function (resultStudent) {
			if (resultStudent === true) {
				return _checkCourse(request, courseId, matriculationId)
					.then(function (resultCourse) {
						if (resultCourse === true) {
							return _signupStudentForCourse(request, courseId, matriculationId)
								.then(function (resultSignup) { return resultSignup; });
						}
						else { return resultCourse; }
					});
			}
			else { return resultStudent; }
		});
};

var _checkStudent = function (request, matriculationId, birthday) {
	return dynamoDb.scan({
			TableName: request.env.tableNameStudents,
			ProjectionExpression: "#mid",
			FilterExpression: "#mid = :matriculationId and #bd = :birthday",
			ExpressionAttributeNames: {"#mid": "matriculationId", "#bd": "birthday"},
			ExpressionAttributeValues: {':matriculationId': matriculationId, ':birthday': birthday}
		})
		.promise()
		.then(function (response) {
			var items = (response && response.Items);
			if (items.length === 1 && items[0].matriculationId === matriculationId) { return true; }
			else { return _getErrorResponse('STUDENT.NOT_FOUND'); }
		}
	);
};

var _checkCourse = function (request, courseId, matriculationId) {
	params = {
		TableName: request.env.tableNameCourses,
		Key: {_id: courseId}
	};

	return dynamoDb.get(params).promise().then(function (response) {
		var item = (response && response.Item);
		var matriculationIds = (item && item.matriculationIds) || [];

		if (item && item.placesFree < 1) { return _getErrorResponse('SIGNUP.COURSE_FULL'); }
		else if (matriculationIds.indexOf(matriculationId.toString()) != -1) { return _getErrorResponse('SIGNUP.ALREADY_SIGNED_UP'); }
		else { return true; }
	});	
};

var _signupStudentForCourse = function (request, courseId, matriculationId) {
	params = {
		TableName: request.env.tableNameCourses,
		Key: {_id: courseId},
		UpdateExpression: 'ADD placesFree :placesFreeDecrement SET matriculationIds = list_append(if_not_exists(matriculationIds, :empty_list), :matriculationId)',
		ExpressionAttributeValues: {':matriculationId': [matriculationId], ':empty_list': [], ':placesFreeDecrement': -1},
		ReturnValues: 'UPDATED_NEW'
	};

	return dynamoDb.update(params).promise()
		.then(function (result) {
			return (result ? _getSuccessResponse('SUCCESS') : _getErrorResponse('UNKNOWN_ERROR'));
		});
};

var _getErrorResponse = function (message) { return _getResponse('ERROR', message); };
var _getSuccessResponse = function (message) { return _getResponse('SUCCESS', message); };
var _getResponse = function (status, message) { return { status: status, message: message }; };

api.addPostDeployConfig('tableNameCourses', 'DynamoDB Courses Table Name:', 'configure-db');
api.addPostDeployConfig('tableNameStudents', 'DynamoDB Students Table Name:', 'configure-db');