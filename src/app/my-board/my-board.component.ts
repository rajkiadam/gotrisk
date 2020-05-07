import { Component, NgModule, Optional, ViewChild } from '@angular/core';
import { BioClientComponent } from 'boardgame.io-angular';
import { CommonModule } from '@angular/common';
import { MapComponent } from '../map/map.component';
import { AreaListComponent } from '../area-list/area-list.component';
import { FormsModule } from '@angular/forms';
import { GameService } from '../game.service';
import { LobbyService } from '../lobby.service';
import { ModalBasicComponent } from '../modal-basic/modal-basic.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-my-board',
  templateUrl: './my-board.component.html',
  styleUrls: ['./my-board.component.css'],
  providers: [
    GameService
  ]
})

/**
 * The complete Board component which handles Game in the background
 */
export class MyBoardComponent {  
  
  /**
   * inidicator whether the user joined the game or not
   */
  userJoined: boolean = false  

  /**
   * Represents if it's the current users turn
   */
  myTurn: boolean = false
  

  /**
   * Ctor
   * @param observableBoardConfig Observable of the whole game config, we can get notifications of the game events and changes
   * @param gameService Separated service to handle events individually
   * @param lobbyService Service for lobby at game startup
   * @param bioClient Client component for the logged in user
   */
  constructor(
  private gameService: GameService,
  private lobbyService: LobbyService,
  @Optional() public bioClient? : BioClientComponent) {      
    lobbyService.playerID = bioClient.playerID
    lobbyService.playerCredential$.subscribe(
      (userjoin) => { this.userJoined = userjoin!=""?true:false; console.log(userjoin) } ) 
    gameService.openModal$.subscribe(
      (open) => {
        if(open){
          this.numberModal.open()
        }
      }
    )
  }  

  /**
   * Child modal which handles number selections for specific actions
   */
  @ViewChild(ModalBasicComponent) numberModal: ModalBasicComponent

}

/**
 * Strange module, necessary for handling Boargame.io Angular unofficial framework
 * (TODO check if it's really necessary)
 */
@NgModule({
  declarations: [
    MyBoardComponent,
    MapComponent,
    AreaListComponent,
    ModalBasicComponent
  ],
  imports: [
    CommonModule, 
    FormsModule,
    NgbModule
  ],  
  providers: [
    LobbyService
  ] 
}) export class StupidButNeededModule {}

