import { Component, OnInit } from '@angular/core';
import { GoTGame } from 'projects/gameengine/src/game';
import { MyBoardComponent } from '../my-board/my-board.component';
import { SocketIO } from 'boardgame.io/multiplayer'
import { LobbyService } from '../lobby.service';


@Component({
  selector: 'my-example',
  template: `
    <ng-container [bioGameConfig]="config">
      <bio-client gameID="{{gameID}}" playerID={{playerID}} ></bio-client>      
    </ng-container>`
}) 
/**
 * Component representing a client in the multiplayer game
 */
export class MyexampleComponent {
  // ID of the player, used at the game state
  playerID: number
  
  // ID of the game room, used at login
  gameID: string

  // config for the client with the gameengine, the board, and the server
  config = {
    game: GoTGame, 
    board: MyBoardComponent, 
    multiplayer: SocketIO({ server: 'http://localhost:8000' }) // http://84.236.29.86:8000' })
  };

  /**
   * Ctor
   * @param lobbyService service for lobby, handling login and game creation
   */
  constructor(private lobbyService: LobbyService) {    
    this.playerID = lobbyService.playerID
    lobbyService.gameID$.subscribe(      
      (gameid) => { this.gameID = gameid; }
    )
  }


}
