#!/bin/bash

script_location="$(cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd)"
current_dir=$(pwd)

# install dependencies
cd $script_location/../course-signup
npm install

# update config file
app_id=$(jq -r '.claudia_app_id' $script_location/../course-signup-config/global.json)
backend_url="$app_id.execute-api.eu-central-1.amazonaws.com/latest"
sed -i "s|CHANGE_ME|$backend_url|" $script_location/../course-signup/app/course-signup/course-signup.js

cd $current_dir