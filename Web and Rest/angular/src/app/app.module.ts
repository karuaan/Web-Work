import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient, HttpHandler } from '@angular/common/http';

import { PdfViewerModule } from 'ng2-pdf-viewer';

import { AppComponent } from './app.component';
import { EmployeesComponent } from './employees/employees.component';
import { EmployeesService } from './employees.service';
import { PendingPipe } from './pending.pipe';


@NgModule({
  declarations: [
    AppComponent,
    EmployeesComponent,
    PendingPipe
  ],
  imports: [
    BrowserModule,
	HttpClientModule,
	PdfViewerModule,
	FormsModule
  ],
  providers: [EmployeesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
