import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
/**
 * Service handling lobby events
 */
export class LobbyService {

  // obeservable creation for game id change
  private gameID = new BehaviorSubject<string>("")
  gameID$ = this.gameID.asObservable()

  /**
   * Setting the game id
   * @param gameid id of the game
   */
  setGameId(gameid: string){
    this.gameID.next(gameid)
  }

  // TODO, remove if not necessary, make private to restrict modification
  playerID: number = 0
  playerCredential = new BehaviorSubject<string>("")
  playerCredential$ = this.playerCredential.asObservable()

  userJoined = new BehaviorSubject<boolean>(false)
  $userJoined = this.userJoined.asObservable()

  constructor() { }
}
