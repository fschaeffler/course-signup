#!/bin/bash

script_location="$(cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd)"
current_dir=$(pwd)
config_json="$script_location/../course-signup-config/global.json"
claudia_json="$script_location/../course-signup-backend/claudia.json"

# remove old config-file
if [[ -f $claudia_json ]]; then
	rm -f $claudia_json
fi

# create claudia.js-app on aws
cd $script_location/../course-signup-backend

claudia create \
	--region eu-central-1 \
	--api-module app \
	--policies policies/*.json

# store to global config
claudia_app_id=$(jq -r '.api.id' $claudia_json)
jq '.claudia_app_id = "'$claudia_app_id'"' $config_json | sponge $config_json

claudia update --configure-db

cd $current_dir