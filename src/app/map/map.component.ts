import { Component, Optional } from '@angular/core';
import { MyBoardComponent } from '../my-board/my-board.component';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']  
})
/**
 * Component for the Game Map
 */
export class MapComponent {
  /* board id for be able to test local multiplayer game 
   * eg.: 2 boards generated with same name, and in the component html the image mapping can't be resolved with same names for the map
   */
  boardId: string

  /**
   * Ctor
   * @param myBoard using the parent Board component
   */
  constructor(@Optional() public myBoard? : MyBoardComponent) {    
    this.boardId = "gotmap"+myBoard.bioClient.playerID
  }
}
