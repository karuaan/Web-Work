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


import { environment } from '../environments/environment';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { AngularFirestoreModule } from 'angularfire2/firestore';

import { AuthService } from './auth.service';
import { Ng4LoadingSpinnerModule, Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { PhonePipe } from './phone.pipe';
import { DefaultToZeroPipe } from './default-to-zero.pipe';

@NgModule({
  declarations: [
    AppComponent,
    EmployeesComponent,
    PendingPipe,
    PhonePipe,
    DefaultToZeroPipe,
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
	AngularFireModule.initializeApp(environment.firebase, 'angular-auth-firebase'),
    AngularFireDatabaseModule,
	AngularFirestoreModule,
    AngularFireAuthModule,
	Ng4LoadingSpinnerModule
  ],
  providers: [EmployeesService,BookService,AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
