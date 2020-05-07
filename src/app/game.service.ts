import { Injectable, Inject } from '@angular/core';
import { BoardBase, BoardConfig, OBSERVABLE_BOARD_CONFIG } from 'boardgame.io-angular';
import { Observable, BehaviorSubject, Subject, observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { first } from 'rxjs/operators';
import { IsMyTerritory, CheckIfAllInitialUnitsPlaced } from 'projects/gameengine/src/game';

@Injectable({
  providedIn: 'root'
})
/**
 * Service for game events and main communication between components in the game
 */
export class GameService extends BoardBase {
  // observable for game phase change
  private phase = new BehaviorSubject<string>("")
  phase$ = this.phase.asObservable()  

  // observable for selected number change (comes for modalbox ModalBasicComponent)
  private selectedNumber = new Subject<number>()
  selectedNumber$ = this.selectedNumber.asObservable()

  // can notify modal to be opened
  private openModal = new Subject<boolean>()
  openModal$ = this.openModal.asObservable()

  // helper properties for game logic
  activePlayer: number // who is the active player
  attackerTerritory: string = null // territory of the attacker
  defenderTerritory: string = null // territory of the defender

  /**
   * Ctor
   * @param observableBoardConfig injected boardconfig (comes from MyBoardComponent)
   */
  constructor(@Inject(OBSERVABLE_BOARD_CONFIG) observableBoardConfig: Observable<BoardConfig>) {         
    // here will be multiple pipes defined on the board config,
    //  the reason is that the observable board config gives notifications every time if any property changes in the object
    //  and this way we can raise events on individual property changes
    //  these will be important parts for the game funcionality
    super(observableBoardConfig);

    console.log(observableBoardConfig)    

    // for testing purpose, writes out the whole game config
    observableBoardConfig.subscribe(
      (value) => {console.log(value)}
    )

    // filtering for the "phase" change in the game object
    observableBoardConfig.pipe(filter(res => res.ctx.phase != this.phase.getValue())).subscribe(
      (value) => { this.phase.next(value.ctx.phase); console.log(value.ctx.phase) }
    )
  }

  /**
   * Click on a map area
   * @param area code name of the area
   */
  areaClick(area: string) {
    if(this.isActive){
      // switch for game phases, for defined phases check projects/gameengine/src/game.js
      switch(this.ctx.phase){
        case 'captureTerritories': {
          this.moves.CaptureTerritory(area)
          break
        }
        case 'placeUnits': {
          if(IsMyTerritory(this.G, this.ctx, area)){
            this.openModal.next(true)
            this.selectedNumber$.pipe(first()).subscribe(
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
        case 'reinforcement': {
          if(IsMyTerritory(this.G, this.ctx, area)){
            this.openModal.next(true)
            this.selectedNumber$.pipe(first()).subscribe(
              (unitNumber) => { 
                if(unitNumber > 0) {
                  this.moves.Reinforce(area, unitNumber)
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
          if(this.attackerTerritory == null) {
            if(IsMyTerritory(this.G, this.ctx, area)){
              this.attackerTerritory = area
            }
            else {
              alert("It's not your territory!")
            }
          }
          else if(!IsMyTerritory(this.G, this.ctx, area)){            
            this.defenderTerritory = area
            this.openModal.next(true)
            this.selectedNumber$.pipe(first()).subscribe(
              (unitNumber) => { 
                if(unitNumber > 0) {
                  // TODO --> attacking stage
                }
              }
            )
          }
          else {
            alert("It's not your territory!")
          }
          break
        }
      }
    }
    else {
      alert("It's not your turn!")
    }
  }

  /**
   * Sets the selected number
   * @param num selected number
   */
  setSelectedNumber(num: number){
    this.selectedNumber.next(num)
  }  

}
