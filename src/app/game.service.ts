import { Injectable, Inject } from '@angular/core';
import { BoardBase, BoardConfig } from 'boardgame.io-angular';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
/**
 * Service for game events and main communication between components in the game
 */
export class GameService {
  
  // observable for game phase change
  private phase = new BehaviorSubject<string>("")
  phase$ = this.phase.asObservable()  

  // observable for active player change
  private activePlayer = new BehaviorSubject<number>(null)
  activePlayer$ = this.activePlayer.asObservable()

  // observable for selected number change (comes for modalbox ModalBasicComponent)
  private selectedNumber = new Subject<number>()
  selectedNumber$ = this.selectedNumber.asObservable()

  /**
   * Ctor
   * @param observableBoardConfig injected boardconfig (comes from MyBoardComponent)
   */
  constructor(@Inject('config') private observableBoardConfig: Observable<BoardConfig>) {         
    // here will be multiple pipes defined on the board config,
    //  the reason is that the observable board config gives notifications every time if any property changes in the object
    //  and this way we can raise events on individual property changes
    //  these will be important parts for the game funcionality

    observableBoardConfig.pipe(filter(res => res.ctx.phase != this.phase.getValue())).subscribe(
      (value) => { this.phase.next(value.ctx.phase); console.log(value.ctx.phase) }
    )

    observableBoardConfig.pipe(filter(res => res.ctx.currentPlayer != this.activePlayer.getValue())).subscribe(
      (value) => { this.activePlayer.next(value.ctx.currentPlayer) }
    )
  }

  // observable for area clicking
  private areaClicked = new Subject<string>()
  areaClicked$ = this.areaClicked.asObservable()

  /**
   * Click on a map area
   * @param area code name of the area
   */
  areaClick(area: string) {
    this.areaClicked.next(area)
  }

  /**
   * Sets the selected number
   * @param num selected number
   */
  setSelectedNumber(num: number){
    this.selectedNumber.next(num)
  }  

}
