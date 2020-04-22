import { Component, OnInit, Optional } from '@angular/core';
import { Area } from 'src/app/area/area';
import { GameService } from '../game.service';

@Component({
  selector: 'app-area-list',
  templateUrl: './area-list.component.html',
  styleUrls: ['./area-list.component.css']
})
/**
 * Component for the image map areas
 */
export class AreaListComponent {

  // list of areas (territories on map)
  areas: Area[]

  /**
   * Ctor
   * Initializing image map areas
   * @param gameService Game service for event handling
   */
  constructor(private gameService: GameService){
    this.areas = new Array()
    // should be aware of territory names -> same should be in game.js territory definition (Todo ? some kind of central storage necessary)
    this.areas.push(new Area("Sandstorm", "","Sandstorm","Sandstorm","", "351,1431,349,1415,355,1416,350,1407,358,1399,356,1387,375,1384,389,1378,386,1367,379,1364,383,1353,385,1339,391,1333,398,1320,411,1317,423,1315,430,1314,430,1303,447,1302,455,1306,462,1314,463,1350,467,1360,473,1368,482,1374,482,1382,489,1386,492,1397,497,1405,502,1415,500,1428,471,1428,442,1431,432,1421,424,1422,411,1427,401,1433,389,1431,378,1432,367,1431,361,1429", "poly"))
    this.areas.push(new Area("Red_Mountain", "","Red Mountain","Red Mountain","", "346,1430,336,1417,327,1419,327,1408,332,1393,326,1372,335,1374,337,1364,343,1352,324,1362,312,1369,297,1374,282,1352,274,1349,275,1340,284,1340,297,1326,309,1317,311,1307,318,1300,312,1292,317,1283,326,1280,330,1271,339,1268,348,1265,351,1254,360,1248,354,1240,363,1236,369,1228,391,1224,410,1224,431,1227,439,1222,449,1222,458,1215,468,1209,488,1209,507,1206,526,1209,543,1216,558,1222,566,1230,552,1239,559,1243,563,1251,556,1258,547,1261,552,1270,540,1274,538,1288,528,1294,523,1303,504,1304,495,1301,489,1309,480,1304,473,1310,462,1310,450,1303,430,1300,428,1311,400,1316,390,1331,384,1337,382,1350,378,1358,378,1367,387,1375,372,1383,354,1384,357,1398,348,1404,354,1411,346,1417", "poly"))
   
  }

  /**
   * Handling on click of an area on the map, and raising an event through the game service
   * @param areaCodeName code name of the area
   */
  onClick(areaCodeName: string) {
    this.gameService.areaClick(areaCodeName)
  }

  
}
