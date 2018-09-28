#!/bin/bash

script_location="$(cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd)"
current=$(pwd)

cd $script_location/../course-signup-backend/fixtures

npm install

node courses.js
node students.js

cd $current