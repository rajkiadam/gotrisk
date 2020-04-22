import { Component } from '@angular/core';
import { LobbyService } from './lobby.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
/**
 * App component
 * Basic initializations, and lobby handling
 */
export class AppComponent {
  title = 'GoTRisk';
  lobby: boolean = true;
  game: boolean = false;

  constructor(private lobbyService: LobbyService){
    lobbyService.$userJoined.subscribe(
      (joined) => { 
        this.lobby = !joined;
        this.game = joined
      }
    )
  }
}
