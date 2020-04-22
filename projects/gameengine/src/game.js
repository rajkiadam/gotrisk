import { TurnOrder } from 'boardgame.io/core'

const initialUnits = 50
const initUnitLimits = new Array(0, 21, 28, 24, 20)

/**
 * Core of the game, which represents a state in the game
 * this state is always sent around for every client by the boardgame.io framework
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
          }, 
          { 
            ID: "Red_Mountain",
            units: 0,
            owner: null,
          }
          ),
        // available units for the players
        availableUnits: Array(ctx.numPlayers).fill(initialUnits), 
        // money of the players
        money: Array(ctx.numPlayers).fill(200),
        // error messages (TODO check other way of communication)
        errorMessages: Array(ctx.numPlayers).fill("")
      }),    
    
    // Everything below is OPTIONAL.

    // define the game phases with available moves and limits
    phases: {
      captureTerritories: {  
        
        moves: { CaptureTerritory },        
        endIf: ( CheckAllTerritoriesCaptured ),
        start: true,
        turn: {
          moveLimit: 0
        },
        next: 'placeUnits'
      },
      placeUnits: {
        moves: { PlaceInitialUnits },
        endIf: ( CheckIfEverybodyPlacedInitialUnits ),
        turn: {
          moveLimit: 0
        }
      },
      invasion: { // TODO
        moves: {},
        endIf: {},
        turn: {
          moveLimit: 0
        }
      }
      // TODO implement other phases
      // 1) reinforcement
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

    // check if has enough units globally (all units of player)
    if(G.availableUnits[ctx.currentPlayer] < numberOfUnit){
      G.errorMessages[ctx.currentPlayer] = "You don't have enough units!"
      return
    }
    
    // check if all units placed
    if(CheckIfAllInitialUnitsPlaced(G, ctx)){
      ctx.events.endTurn()
    }
    
    // check if has enough available units to place initially in this phase
    var remaining = initUnitLimits[ctx.numPlayers-1] - (initialUnits - G.availableUnits[ctx.currentPlayer])
    if(remaining < numberOfUnit){      
      G.errorMessages[ctx.currentPlayer] = "You can only place "+remaining+" units!"
      return
    }
        
    var i = GetTerritoryArrayIndex(G, ctx, territory)
    G.territories[i].units += numberOfUnit
    G.availableUnits[ctx.currentPlayer] -= numberOfUnit
    console.log("Player "+ctx.currentPlayer+ " has "+ G.availableUnits[ctx.currentPlayer] + " free units.")
    ctx.events.endTurn()
  }

  /**
   * Criteria for end of "placeUnits" phase
   * Checks if everybody placed all their specified units
   * @param {*} G game object
   * @param {*} ctx context object
   */
  function CheckIfEverybodyPlacedInitialUnits(G, ctx){
    var isReady = true
    G.availableUnits.forEach(item => {
      if(item != initialUnits - initUnitLimits[ctx.numPlayers]) {
        isReady = false
      }
    })
    if(isReady){
      console.log("phase end")
    }
    return isReady
  }

  /**
   * Check if the current player has placed all initial units in phase "placeUnits"
   * @param {*} G game objectv
   * @param {*} ctx context object
   */
  export function CheckIfAllInitialUnitsPlaced(G, ctx) {   
    if(initialUnits - G.availableUnits[ctx.currentPlayer] >= initUnitLimits[ctx.numPlayers-1]){
      G.errorMessages[ctx.currentPlayer] = "You have placed your units!"
      console.log('all placed')
      return true
    }
    return false
  }