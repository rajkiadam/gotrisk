# GoTRisk

The aim of this project is to digitalize the Risk: Game of Thrones edition boardgame into a web based  multiplayer application.
Also in this project I've started to learn and use Angular for front-end development.

The project is now focusing on the core functionalities without any styling.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.1.0.

## Game server and client

Run `node -r esm src/server.js` to run the game server on your local machine.

Run `ng serve --open` to run the client on your local machine.

Note: before starting the client, check and modify the base url in [lobby.component.ts](src/app/lobby/lobby.component.ts) to be able to communicate with your localhost server on port 8000.

Issue: please create the game in separated window, and then join the game in other windows (the game login hasissue if it has generated the game room.

Issue: please restart the server on new game start (the game state is not updated sometimes even in separated new room for the initial state)

## Third party components

Board game engine [Boardgame.io](http://boardgame.io).

[Angular-Boardgame.io](https://github.com/turn-based/boardgame.io-angular) project for angular sample for boardgame.io usage .
