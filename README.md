# Schedule System

This repository will hold the source code for the schedule system for Coastal Health - GF Strong as part of the CPSC 319 Software Engineering Project course.

## Setup Guide
### Node Setup
Node version: 8.15.0 (lts/carbon)

Using **nvm** is highly recommended (https://github.com/creationix/nvm)
```
$ nvm install lts/carbon
$ nvm use lts/carbon
$ nvm alias default lts/carbon
```

### Environment Setup
NOTE: Using .env file for setup is highly recommended
1. create a file *.env* in project root (i.e. ~/path/to/schedule-system/.env)
2. add following lines into .env file

(For *secret_key*, see https://randomkeygen.com/ --> **CodeIgniter Encryption Keys**)
```
COOKIE_SESSION_KEY=secret_key
DB_USERNAME=username
DB_PASSWORD=password
DB_HOST=localhost
DB_NAME=schedule_system
SERVER_PORT=4000
```

3. create a file *.env* in client root (i.e. ~/path/to/schedule_system/client/.env)
4. add following lines into .env file
```
NODE_PATH=src/
```

### DB Setup
1. MySQL version 8.0.13 is definitely being supported. Not guaranteed for other version

```
<!-- Migration instruction -->
$ mysql -u root -p
$ Enter Password: your_password
$ source ~/path/to/schedule-system/config/db/migrate.sql
```

### Commands to Run Application
#### Dev Environment
NOTE: to avoid any possible crash, running concurrent package will NOT be used at the moment. Instead, use two separate terminal tabs to run Server & Client
```
<!-- Server -->
$ npm install
$ npm run server-dev
```
```
<!-- Client -->
$ cd client
$ npm install
$ npm run start
```