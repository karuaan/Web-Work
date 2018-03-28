import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TagInputModule } from 'ngx-chips';

import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';  // <-- #1 import module

import { PdfViewerModule } from 'ng2-pdf-viewer';

import { AppComponent } from './app.component';
import { EmployeesComponent } from './employees/employees.component';
import { EmployeesService } from './employees.service';
import { PendingPipe } from './pending.pipe';
import {BookService} from "./book.service";

import { ToastrModule } from 'ngx-toastr';


@NgModule({
  declarations: [
    AppComponent,
    EmployeesComponent,
    PendingPipe,
  ],
  imports: [
    BrowserModule,
      BrowserAnimationsModule,
      ToastrModule.forRoot(),
      FormsModule,
      TagInputModule,
      ReactiveFormsModule,
	HttpClientModule,
	PdfViewerModule,
  ],
  providers: [EmployeesService,BookService],
  bootstrap: [AppComponent]
})
export class AppModule { }
