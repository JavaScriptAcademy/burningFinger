# burningFinger
### A typing game which can allow as many people as possible to compete against each other.

![burningFinger preview](https://github.com/JavaScriptAcademy/burningFinger/blob/master/burningFinger.gif)

## PRE-CONDITION
Download [meteor](https://www.meteor.com/) from the official website.

    The version of tools used:
    meteor version 1.3
    npm version 3.3.9
    node version 6.2.0
  
If you are using different version of meteor, please run `meteor update --release 1.3.5.1` and then run `meteor npm rebuild` 
  
## SETUP
npm install && meteor npm install

## RUN
npm start

## RESET DATABASE
meteor reset

## PACKAGES
    mongo                   # The database Meteor supports right now
    materialize:materialize # The user interface design
    iron:router             # The routing system
    stevezhu:lodash         # Utility library
    aldeed:collection2      # Extends Mongo.Collection to provide support for schema and validation
    accounts-ui             # Account plugin
    accounts-password       # Account plugin
    accounts-base           # Account plugin

## MAIN FEATURES
* Every player can create a room and become the room owner
* Each room will generate a random meaningless paragraph for competetion
* Every player can join a pending room
* Room owner can start a game
* The room which is starting the game can not be accessed by other player
* Real time words checking 
* Real time competetion result tracking
