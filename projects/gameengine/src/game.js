import { TurnOrder } from 'boardgame.io/core'
import { Stage } from 'boardgame.io/dist/cjs/reducer-c8fe777c';

const initialUnits = 50
const initUnitLimits = new Array(0, 21, 28, 24, 20)

/**
 * Core of the game, which represents a state in the game
 * this state is always sent around for every client by the boardgame.io framework
 * for better understanding check documentation at: https://boardgame.io/documentation/#/
 */
export const GoTGame = {
    // The name of the game.
    name: 'GoT-Risk',
  
    // Function that returns the initial value of G.
    // setupData is an optional custom object that is
    // passed through the Game Creation API.
    setup: ctx => (
      {
        // territories on the map
        territories: Array(
          { 
            ID: "Sandstorm",
            units: 0,
            owner: null,
            hasCastle: true,
            hasPort: false
          }, 
          { 
            ID: "Red_Mountain",
            units: 0,
            owner: null,
            hasCastle: false,
            hasPort: false
          }
          ),
        // available units for the players
        availableUnits: Array(ctx.numPlayers).fill(initialUnits-initUnitLimits[ctx.numPlayers-1]),
        initialPlaceUnits: Array(ctx.numPlayers).fill(initUnitLimits[ctx.numPlayers-1]),
        minReinforcementUnits: 3,
        // money of the players
        money: Array(ctx.numPlayers).fill(200),
        // error messages (TODO check other way of communication)
        errorMessages: Array(ctx.numPlayers).fill(""),
        reinforcements: Array(ctx.numPlayers).fill(0),
        skipplayers: Array(),
        attackingUnits: Array(ctx.numPlayers).fill(0),
        attackerArea: null,
        attackerDice: 0,
        defenderArea: null,
        defenderDice: 0
      }),    
    
    // Everything below is OPTIONAL.
    
    turn: {
      // end the turn if everyone has passed
      // endIf: (G, ctx) => (
      //   ctx.playOrder.length === G.passedPlayers.length
      // ),
      order: {
        // Get the initial value of playOrderPos.
        // This is called at the beginning of the phase.
        first: (G, ctx) => 0,
    
        next: (G, ctx) => {
          // build a play order array starting with the 
          // next player according to ctx.playOrder
          const nextIdx = ctx.playOrderPos + 1;
          const nextArr = [
            ...ctx.playOrder.slice(nextIdx),
            ...ctx.playOrder.slice(0, nextIdx)
          ];
    
          // find the first player who hasn’t passed
          let nextPlayer;
          for (var i = 0; i < nextArr.length; i++) {
            const nextId = nextArr[i];
            if (!G.skipplayers.includes(nextId)) {
              nextPlayer = nextId;
              break;
            }
          }
          return ctx.playOrder.findIndex((element) => element == nextPlayer);
        }
      },
    },

    // define the game phases with available moves and limits
    phases: {
      captureTerritories: {          
        moves: { CaptureTerritory },        
        endIf: ( CheckAllTerritoriesCaptured ),
        start: true,
        next: 'placeUnits'
      },
      placeUnits: {
        moves: { PlaceInitialUnits },
        endIf: ( CheckIfEverybodyPlacedInitialUnits ),
        next: 'reinforcement',
        onEnd: (G, ctx) => { G.skipplayers = new Array(); SetReinforcements(G, ctx) }
      },
      reinforcement: {
        moves: { Reinforce },
        endIf: ( CheckIfEverybodyReinforced ),        
      },
      invasion: {
        moves: { Invade }, // TODO FinishInvasion
        turn: {
          stages: {
            attack: {
              moves: { AttackingDice } // TODO Retreat
            },
            defend: {
              moves: { DefendingDice }
            }
          }
        }
      }
      // TODO implement other phases
      // 1) reinforcement - DONE
      // 2) regrouping
      // if the game will be implemented for complex moves then
      // 3) card buying
      // 4) mission completion
      
      // TODO:: should defined End of Game
    },    
  }

  /**
   * MOVE <-- indicating a game move
   * Capturing a territory at the beginnning of the game
   * @param {*} G game object
   * @param {*} ctx context object
   * @param {*} territory code name of the territory
   */
  function CaptureTerritory(G, ctx, territory) {    
    var i = GetTerritoryArrayIndex(G, ctx, territory)
    if(G.territories[i].units != 0){
      //alert("This territory is already captured by X!")
      G.errorMessages[ctx.currentPlayer] = "This territory is already captured!"
      return
    }

    G.money = new Array()
    G.territories[i].units++
    G.territories[i].owner = ctx.currentPlayer
    G.availableUnits[ctx.currentPlayer]--
    console.log("Player "+ctx.currentPlayer+ " has "+ G.availableUnits[ctx.currentPlayer] + " free units.")
    ctx.events.endTurn()
  }

  /**
   * Criteria for end of "captureTerritories" phase
   * every (defined) territory should be captured
   * @param {*} G game object
   * @param {*} ctx context object
   */
  function CheckAllTerritoriesCaptured(G, ctx){    
    var owners = G.territories.map(function(item){
      return item.owner
    })
    var filled = true
    owners.forEach(element => {
      if(element == null){
        filled = false
      }      
    });
    return filled
  }

  /**
   * Check if the area is owned by the current user (discovered from context)
   * @param {*} G game object
   * @param {*} ctx context object
   * @param {*} territory code name of the territory
   */
  export function IsMyTerritory(G, ctx, territory) {
    return GetTerritoryById(G, ctx, territory).owner == ctx.currentPlayer
  }

  /**
   * Get a territory by it's code name (identifier)
   * @param {*} G game object
   * @param {*} ctx context object
   * @param {*} territory code name of the territory
   */
  function GetTerritoryById(G, ctx, territory) {
    var i = GetTerritoryArrayIndex(G, ctx, territory)
    return G.territories[i]
  }

  /**
   * Finds the index of the specified territory in the array
   * @param {*} G game object
   * @param {*} ctx context object
   * @param {*} territory code name of the territory
   */
  function GetTerritoryArrayIndex(G, ctx, territory) {
    return G.territories.findIndex(x => x.ID == territory)
  }

  /**
   * MOVE
   * Placing initial units on an already captured territory
   * @param {*} G game object
   * @param {*} ctx context object
   * @param {*} territory code name of the territory
   * @param {*} numberOfUnit number of units to place
   */
  function PlaceInitialUnits(G, ctx, territory, numberOfUnit) {
    // check if own territory
    if(!IsMyTerritory(G, ctx, territory)){
      G.errorMessages[ctx.currentPlayer] = "This is not your territory!"
      return
    }

    // check if has enough available units to place initially in this phase
    if(G.initialPlaceUnits[ctx.currentPlayer] < numberOfUnit){      
      G.errorMessages[ctx.currentPlayer] = "You can only place "+G.initialPlaceUnits[ctx.currentPlayer]+" units!"
      return
    }
        
    var i = GetTerritoryArrayIndex(G, ctx, territory)
    G.territories[i].units += numberOfUnit
    G.initialPlaceUnits[ctx.currentPlayer] -= numberOfUnit
    console.log("Player "+ctx.currentPlayer+ " has "+ G.initialPlaceUnits[ctx.currentPlayer] + " free initial units.")
    if(CheckIfAllInitialUnitsPlaced(G, ctx)){
      PlayerPassedTurn(G, ctx)
    }
    ctx.events.endTurn()
  }

  /**
   * Criteria for end of "placeUnits" phase
   * Checks if everybody placed all their specified units
   * @param {*} G game object
   * @param {*} ctx context object
   */
  function CheckIfEverybodyPlacedInitialUnits(G, ctx) {        
    var sum = G.initialPlaceUnits.reduce((a, b) => a + b, 0)
    if(sum == 0){      
      return true;
    }
    return false
  }

  /**
   * Check if the current player has placed all initial units in phase "placeUnits"
   * @param {*} G game object
   * @param {*} ctx context object
   */
  export function CheckIfAllInitialUnitsPlaced(G, ctx) {
    if(G.initialPlaceUnits[ctx.currentPlayer] == 0){      
      return true
    }
    return false
  }

  /**
   * Reinforcing move
   * @param {*} G game object
   * @param {*} ctx context object
   * @param {string} territory code of the territory
   * @param {number} numberOfUnit number of units to be place as reinforcement
   */
  function Reinforce(G, ctx, territory, numberOfUnit) {
    if(!IsMyTerritory(G, ctx, territory)) {
      G.errorMessages[ctx.currentPlayer] = "This is not your territory!"
      return
    }    
    
    // check if has enough available units to place the reinfocement in this phase
    if(G.reinforcements[ctx.currentPlayer] < numberOfUnit){      
      G.errorMessages[ctx.currentPlayer] = "You can only place " + G.reinforcements[ctx.currentPlayer] + " units!"
      return
    }

    var i = GetTerritoryArrayIndex(G, ctx, territory)
    G.territories[i].units += numberOfUnit
    G.reinforcements[ctx.currentPlayer] -= numberOfUnit    
    if(CheckIfAllReinforcementPlaced(G, ctx)){      
      ctx.events.endTurn()
    }
    return
  }

  /**
   * Flag to check if everybody placed their reinforcements
   * @param {*} G game object
   * @param {*} ctx context object
   */
  function CheckIfEverybodyReinforced(G, ctx) {
    var result = true
    G.reinforcements.forEach(item => {      
      if(item != 0) {        
        result = false
      }      
    })
    return result
  }

  /**
   * Flag to check if a player has put all his reinforcements
   * @param {*} G game object
   * @param {*} ctx context object
   */
  function CheckIfAllReinforcementPlaced(G, ctx) {    
    if(G.reinforcements[ctx.currentPlayer] == 0){
      return true
    }
    return false
  }
 
  /**
   * Sets the amount of reinforcement units before the reinforcement phase starts
   * @param {*} G game object
   * @param {*} ctx context object
   */
  function SetReinforcements(G, ctx) {
    var ownedTerritories = new Array(ctx.numPlayers).fill(0)
    G.territories.forEach(item => {
      ownedTerritories[item.owner]++
      if(item.hasCastle) {
        ownedTerritories[item.owner]++
      }
    })
    for(var i = 0; i < ctx.numPlayers; i++) {
      G.reinforcements[i] = Math.floor(ownedTerritories[i] / 3)      
      if(G.reinforcements[i] < G.minReinforcementUnits) {
        G.reinforcements[i] = G.minReinforcementUnits
      }
      else if(G.reinforcements[i] > G.availableUnits[i]){
        G.reinforcements[i] = G.availableUnits[i]
        G.availableUnits[i] = 0        
        console.log("max number of units exceeded")
      }      
    }
    
  }

  /**
   * Sets a player as 'inactive' in the turn
   * @param {*} G game object
   * @param {*} ctx context object
   */
  function PlayerPassedTurn(G, ctx) {
    G.skipplayers.push(ctx.currentPlayer)
  }

  /**
   * Invasion move
   * @param {*} G game object
   * @param {*} ctx context object
   * @param {string} attackerArea territory code of the attacker
   * @param {number} numberOfUnit number of attacking units
   * @param {string} defenderArea territory code of the defender
   */
  function Invade(G, ctx, attackerArea, numberOfUnit, defenderArea) {
    if(GetTerritoryById(attackerArea).units + 1 <= numberOfUnit){
      // error, not enough units
    }
    else{
      G.attackingUnits[ctx.currentPlayer] += numberOfUnit
      G.attackerArea = attackerArea
      G.defenderArea = defenderArea
      ctx.events.setActivePlayers({ currentPlayer: 'attack' })
    }
  }

  /**
   * Attacker dice
   * TODO TEST
   * @param {*} G game object
   * @param {*} ctx context object
   */
  function AttackingDice(G, ctx) {
    G.attackerDice = Math.floor(Math.random() * 6) + 1    
    var territory = GetTerritoryById(G.defenderArea)    
    ctx.events.setActivePlayers({ all: Stage.NULL })
    ctx.events.setActivePlayers({ [territory.owner]: 'defend' })
  }

  /**
   * Defending dice
   * TODO TEST
   * @param {*} G game object
   * @param {*} ctx context object
   * @param {*} defenderArea territory code of the defender
   */
  function DefendingDice(G, ctx, defenderArea) {
    G.defenderDice = Math.floor(Math.random() * 6) + 1    
    var territory = GetTerritoryById(G.defenderArea)    
    ctx.events.setActivePlayers({ all: Stage.NULL })
    ctx.events.setActivePlayers({ [territory.owner]: 'defend' })
  }


  