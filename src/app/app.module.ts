import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NgxSplitItemComponent } from './ngx-split-item/ngx-split-item.component';
import { ResizableDirective } from './ngx-split-item/resizable.directive';

@NgModule({
  declarations: [
    AppComponent,
    NgxSplitItemComponent,
    ResizableDirective
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
