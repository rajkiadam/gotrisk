/**
 * FILE UNUSED
 * created only for testing purpuse
 * USE game.js instead
 */


import { BehaviorSubject } from 'rxjs'

const initialUnits = 20

export const GoTGame = {
    // The name of the game.
    name: 'GoT-Risk',
  
    // Function that returns the initial value of G.
    // setupData is an optional custom object that is
    // passed through the Game Creation API.
    setup: ctx => (
      { 
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
        availableUnits: Array<number>(ctx.numPlayers).fill(initialUnits), //new BehaviorSubject<Array<Number>>(Array(ctx.numPlayers).fill(initialUnits)),
        money: Array<number>(ctx.numPlayers).fill(200), //new BehaviorSubject<Array<Number>>(Array(ctx.numPlayers).fill(200)),
        errorMessages: Array<string>(ctx.numPlayers).fill(""),// new BehaviorSubject<Array<string>>(Array(ctx.numPlayers).fill("initialUnits")),
        phaseObservable: new BehaviorSubject<string>("")
      }),    
    
    // Everything below is OPTIONAL.
    phases: {
      captureTerritories: {  
        moves: { CaptureTerritory },        
        endIf: ( CheckAllTerritoriesCaptured ),
        start: true,
        turn: {
          moveLimit: 0
        },
        next: 'placeUnits',
        onBegin: (G) => { G.phaseObservable.next("captureTerritories") }
      },
      placeUnits: {
        moves: { PlaceInitialUnits },
        endIf: ( CheckIfEverybodyPlacedInitialUnits ),
        turn: {
          moveLimit: 0
        },
        onBegin: (G) => { G.phaseObservable.next("placeUnits") }
      }
    }    
  }

  function CaptureTerritory(G, ctx, territory) {    
    var i = GetTerritoryArrayIndex(G, ctx, territory)
    if(G.territories[i].units != 0){
      //alert("This territory is already captured by X!")
      G.errorMessages[ctx.currentPlayer] = "This territory is already captured!"
      return
    }
    G.territories[i].units++
    G.territories[i].owner = ctx.currentPlayer
    // var array = G.availableUnits.getValue()
    // array[ctx.currentPlayer]--
    // G.availableUnits.next(array)
    G.availableUnits[ctx.currentPlayer]--
    console.log("Player "+ctx.currentPlayer+ " has "+ G.availableUnits[ctx.currentPlayer] + " free units.")
    ctx.events.endTurn()
  }

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

  function IsMyTerritory(G, ctx, territory) {
    return GetTerritoryById(G, ctx, territory).owner == ctx.currentPlayer
  }

  function GetTerritoryById(G, ctx, territory) {
    var i = GetTerritoryArrayIndex(G, ctx, territory)
    return G.territories[i]
  }

  function GetTerritoryArrayIndex(G, ctx, territory) {
    return G.territories.findIndex(x => x.ID == territory)
  }

  function PlaceInitialUnits(G, ctx, territory, numberOfUnit) {
    if(!IsMyTerritory(G, ctx, territory)){
      G.errorMessages[ctx.currentPlayer] = "This is not your territory!"
      return
    }
    if(G.availableUnits[ctx.currentPlayer] < numberOfUnit){
      G.errorMessages[ctx.currentPlayer] = "You don't have enough units!"
      return
    }
    
    var i = GetTerritoryArrayIndex(G, ctx, territory)
    G.territories[i].units += numberOfUnit
    G.availableUnits[ctx.currentPlayer] -= numberOfUnit
    console.log("Player "+ctx.currentPlayer+ " has "+ G.availableUnits[ctx.currentPlayer] + " free units.")
    ctx.events.endTurn()
  }

  function CheckIfEverybodyPlacedInitialUnits(G, ctx){
    var isReady = true
    G.availableUnits.forEach(item => {
      if(item != initialUnits - 10) {
        isReady = false
      }
    })
    return isReady
  }