import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

//Third party imports
import {NgxLoadingModule} from 'ngx-loading';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FlexLayoutModule} from '@angular/flex-layout';

import {MaterialModule} from './shared/material.module';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import {DataService} from './services/dataservice';
import {HttpClientModule} from '@angular/common/http';
import { Helperclass } from './Class/helperclass';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxLoadingModule.forRoot({})
  ],
  providers: [DataService,
   Helperclass],
  bootstrap: [AppComponent]
})
export class AppModule { }
