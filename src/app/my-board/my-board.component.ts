import { Component, Inject, NgModule, Optional, ViewChild, OnInit } from '@angular/core';
import { BoardBase, OBSERVABLE_BOARD_CONFIG, BoardConfig, BioClientComponent } from 'boardgame.io-angular';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MapComponent } from '../map/map.component';
import { AreaListComponent } from '../area-list/area-list.component';
import { FormsModule } from '@angular/forms';
import { GameService } from '../game.service';
import { LobbyService } from '../lobby.service';
import { ModalBasicComponent } from '../modal-basic/modal-basic.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { first } from 'rxjs/operators';
import { IsMyTerritory, CheckIfAllInitialUnitsPlaced } from 'projects/gameengine/src/game';

@Component({
  selector: 'app-my-board',
  templateUrl: './my-board.component.html',
  styleUrls: ['./my-board.component.css'],
  providers: [
    GameService,
    { provide: 'config', useExisting: OBSERVABLE_BOARD_CONFIG }
  ]
})

/**
 * The complete Board component which handles Game in the background
 */
export class MyBoardComponent extends BoardBase implements OnInit {  
  
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
  constructor(@Inject(OBSERVABLE_BOARD_CONFIG) observableBoardConfig: Observable<BoardConfig>,  
  private gameService: GameService,
  private lobbyService: LobbyService,
  @Optional() public bioClient? : BioClientComponent) {  
    super(observableBoardConfig);
    
    lobbyService.playerID = bioClient.playerID
    lobbyService.playerCredential$.subscribe(
      (userjoin) => { this.userJoined = userjoin!=""?true:false; console.log(userjoin) } )
    
    // Subscribing for the player change event
    // currently testing TODO
    gameService.activePlayer$.subscribe(
      (player) => {
        this.myTurn = player == bioClient.playerID;
        console.log("Me: " + bioClient.playerID.toString())
        console.log("Pushed: " + player.toString())
        if(this.ctx.phase == 'placeUnits' && this.ctx.currentPlayer == bioClient.playerID){
          console.log("ItsME\n")
          if(CheckIfAllInitialUnitsPlaced(this.G, this.ctx)){
            console.log("auto End Turn\n")
            this.ctx.events.endTurn()
          }
        }
      }
    )
  }

  ngOnInit(): void {
    // Subscribing to area clicked event (comes from a separated component through the gameservice)
    this.gameService.areaClicked$.subscribe(
      (area) => this.areaAction(area)
    )
  }

  /**
   * Child modal which handles number selections for specific actions
   */
  @ViewChild(ModalBasicComponent) numberModal: ModalBasicComponent

  
  /**
   * The function will handle the main action calls of the game
   * (Later it can be splitted into multiple functions, or placed to an individual service -> first try the Boardgame.io logic this easy way)
   * @param area Code name of the area clicked on the map
   */
  areaAction(area: string) {    
    if(this.ctx.currentPlayer == this.bioClient.playerID){
      // switch for game phases, for defined phases check projects/gameengine/src/game.js
      switch(this.ctx.phase){
        case 'captureTerritories': {
          this.moves.CaptureTerritory(area)
          break
        }
        case 'placeUnits': {
          if(IsMyTerritory(this.G, this.ctx, area)){
            this.numberModal.open()
            //this.mapComponent.myBoard.moves.PlaceInitialUnits(areaCodeName, 1)
            this.gameService.selectedNumber$.pipe(first()).subscribe(
              (unitNumber) => { 
                if(unitNumber > 0) {
                  this.moves.PlaceInitialUnits(area, unitNumber)
                }
              }
            )
          }
          else {
            alert("It's not your territory!")
          }
          break
        }
        case 'invasion': {
          // if(this.clickedAreas.length == 0) {
          //   this.clickedAreas.push(areaCodeName)
          // }
          // else {
          //   this.clickedAreas.push(areaCodeName)
          //   this.mapComponent.myBoard.moves.Invade(this.clickedAreas[0], this.clickedAreas[1])
          //   this.clickedAreas = new Array()
          // }
          break
        }
      }
    }
    else {
      alert("It's not your turn!")
    }
  }
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

