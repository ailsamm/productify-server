# Productify Server

Productify Server works in conjunction with [Productify](https://github.com/ailsamm/productify). It provides a Postgresql database containing all of the data needed to populate and run the Productify client-side app. 

## Demo

A demo version of the Productify app, using this server, is available [here](https://productify-app.now.sh/).
Use the following dummy credentials to log in and take a tour:

Username: aaa@gmail.

Password: aaa

## Installation

Simply clone the repo and run ```npm i```
You can then make requests using, for example, Postman or the Productify client-side app.

## Tech Stack
The Productify Server is written with NodeJS, Express and hooks up to a Postgresql server. It also makes use of Mocha and Chai for testing purposes.
