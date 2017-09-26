#!/bin/bash

sudo apt-get install awscli -y
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.4/install.sh | bash
nvm install 4

npm install -g claudia

git clone https://github.com/fschaeffler/course-signup.git
cd course-signup/course-signup-backend
npm install