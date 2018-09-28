#!/bin/bash

script_location="$(cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd)"
current_dir=$(pwd)

policy_json="$script_location/../course-signup-backend/policies/access-dynamodb.json"
config_json="$script_location/../course-signup-config/global.json"

courses_arn=$(jq -r '.courses_arn' $config_json)
students_arn=$(jq -r '.students_arn' $config_json)
jq '.Statement[0].Resource = ["'$courses_arn'", "'$students_arn'"]' $policy_json | sponge $policy_json

lambda_role=$(jq -r '.lambda.role' $script_location/../course-signup-backend/claudia.json)
aws iam put-role-policy \
	--role-name $lambda_role \
	--policy-name access-ses \
	--policy-document file://$script_location/../course-signup-backend/policies/access-ses.json

$script_location/04-setup-frontend.sh

cd $script_location/../course-signup-backend

claudia update --policies policies/*.json

cd $current_dir