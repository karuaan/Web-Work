import { BrowserModule } from '@angular/platform-browser';
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

import { environment } from '../environments/environment';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { AuthService } from './auth.service';

@NgModule({
  declarations: [
    AppComponent,
    EmployeesComponent,
    PendingPipe,
  ],
  imports: [
    BrowserModule,
      FormsModule,
      ReactiveFormsModule,
	HttpClientModule,
	PdfViewerModule,
	AngularFireModule.initializeApp(environment.firebase, 'angular-auth-firebase'),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  providers: [EmployeesService,BookService,AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
