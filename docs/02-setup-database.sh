#!/bin/bash

script_location="$(cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd)"
policy_json="$script_location/../course-signup-backend/policies/access-dynamodb.json"
config_json="$script_location/../course-signup-config/global.json"

# setup database
courses_arn=$(aws dynamodb create-table \
	--table-name course-signup_courses \
	--attribute-definitions AttributeName=_id,AttributeType=S \
	--key-schema AttributeName=_id,KeyType=HASH \
	--provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1 \
	--query TableDescription.TableArn \
	--region eu-central-1 \
	--output text)

students_arn=$(aws dynamodb create-table \
	--table-name course-signup_students \
	--attribute-definitions AttributeName=_id,AttributeType=S \
	--key-schema AttributeName=_id,KeyType=HASH \
	--provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1 \
	--query TableDescription.TableArn \
	--region eu-central-1 \
	--output text)

echo "Courses Database ARN: $courses_arn"
echo "Students Database ARN: $students_arn"

# store to backend-config
jq '.Statement[0].Resource = ["'$courses_arn'", "'$students_arn'"]' $policy_json | sponge $policy_json

# store to global config
jq '.courses_arn = "'$courses_arn'"' $config_json | sponge $config_json
jq '.students_arn = "'$students_arn'"' $config_json | sponge $config_json