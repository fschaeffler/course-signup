#!/bin/bash

script_location="$(cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd)"
current_dir=$(pwd)

# update system
sudo apt-get update; sudo apt-get upgrade -y

# install aws cli
sudo apt-get install awscli jq moreutils -y
aws configure

# install nodejs via nvm
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

nvm install 8

# install claudia.js
npm install -g claudia

# prepare course-signup-app
cd $script_location/../course-signup/course-signup-backend
npm install

cd $current_dir