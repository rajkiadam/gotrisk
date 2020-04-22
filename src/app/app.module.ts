import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BoardgameIoModule } from 'boardgame.io-angular';
import { MyexampleComponent } from './myexample/myexample.component';
import { HttpClientModule } from '@angular/common/http'
import { LobbyComponent } from './lobby/lobby.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    MyexampleComponent,
    LobbyComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BoardgameIoModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [
    AppComponent,
    MyexampleComponent
  ]
})
export class AppModule { }
