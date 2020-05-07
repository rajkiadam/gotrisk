import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { LobbyService } from '../lobby.service';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
/**
 * Component for the Lobby
 * Functions: Game creation, and joining in a game
 */
export class LobbyComponent {
  // number of players to create a game with
  numberOfPlayers: number = 2
  // id of the created game
  gameIdCreated: string = ""
  // id for the game to join with
  gameIdJoin: string
  // id of the player
  playerID: number
  // base url for the hosted game !! WARNING !! should be replaced to local testing
  //baseUrl: string = "http://84.236.29.86:8000/games/GoT-Risk" // port forwarded test server
  baseUrl: string = "http://localhost:8000/games/GoT-Risk" // local test server 

  /**
   * Ctor
   * @param lobbyervice lobbyservice injection
   * @param http http servce for communication with the server
   */
  constructor(private lobbyervice: LobbyService, private http: HttpClient) { }

  /**
   * Creating a game
   */
  createGame() {

    // http call to create a room with players
    //this.gameIdCreated = "your-game-id"    
    this.createGamePost().subscribe(
      obj => {      
        this.gameIdCreated = obj.gameID;
        this.lobbyervice.setGameId(obj.gameID)        
      }
    )
    console.log("Game-created")
  }

  /**
   * Joining a game
   * @param playerID ID of the player
   */
  joinGame(playerID: number) {
    this.lobbyervice.playerID = playerID;
    this.joinGamePost(playerID).subscribe(
      obj => { 
        this.lobbyervice.userJoined.next(true);
        
      }
    )
    
  }

  // post request to the server to create a game room
  createGamePost() : Observable<GameResponse> {
    return this.http.post<GameResponse>(this.baseUrl + "/create", { numPlayers: this.numberOfPlayers })
  }

  // post request to the server to join a game room
  joinGamePost(playerID: number) : Observable<JoinResponse> {    
    return this.http.post<JoinResponse>(this.baseUrl + "/" + this.gameIdJoin + "/join", { playerID: playerID, playerName: "player-"+playerID })
  }

}

/**
 * Server response on game creation (maybe simple value would be enough, TODO)
 */
class GameResponse {
  gameID: string
}

/**
 * Server response on joining a game (maybe simple value would be enough, TODO)
 */
class JoinResponse {
  playerCredentials: string
}
