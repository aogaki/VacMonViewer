import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import {
  MatToolbarModule,
  MatCardModule,
  MatSlideToggleModule,
  MatSelectModule,
  MatCheckboxModule,
  MatGridListModule
} from "@angular/material";
import { FlexLayoutModule } from "@angular/flex-layout";

import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    FlexLayoutModule,
    MatToolbarModule,
    MatCardModule,
    MatGridListModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatCheckboxModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
