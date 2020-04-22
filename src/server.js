const Server = require('boardgame.io/server').Server;
const MyGotGame = require('../projects/gameengine/src/game').GoTGame;

// defines a server for the game running on port 8000
const server = Server({ 
    games: [MyGotGame]
});
server.run(8000);