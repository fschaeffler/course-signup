# Setup

# aws cli

```
sudo apt-get install -y awscli
```

# node.js (via NVM)

```
sudo apt-get install -y curl
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.2/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm install 4
npm install npm -g
```
# claudia.js

```
npm install claudia -g
```

# dependencies

```
cd course-signup-backend; npm install
``

# Changelog

##  version 0.0.1

- added lambda functions for getting courses
- added lambda functions for signing up a student
- added communication with DynamoDB

## version 0.0.2

- added confirmation email via SES on signup

## version 0.0.3

- added custom domain name for api-gateway endpoint

## version 0.0.4

- added staging configuration

## version 0.0.5

- added deployment to S3
