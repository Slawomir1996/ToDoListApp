import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AdminComponent } from './admin/admin.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';

import { UsersComponent } from './components/users/users.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { WorkspaceComponent } from './components/workspace/workspace.component';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { WINDOW_PROVIDERS } from './window-token';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { UpdateProfileComponent } from './components/update-profile/update-profile.component';
import { AllTaskComponent } from './components/list-entry/all-lists-entries/all-task.component';
import { CreateListEntryComponentComponent } from './components/list-entry/create-list-entry-component/create-list-entry-component.component';
import { SingleTaskComponent } from './components/list-entry/complete-lists/single-task.component';
import { ListForDayComponentComponent } from './components/list-entry/list-for-day-component/list-for-day-component.component';
import { MatDialogModule } from '@angular/material/dialog';
import { EditItemComponent } from './components/edit-item/edit-item.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CalendarComponent } from './components/calendar/calendar.component';
import { HederComponent } from './heder/heder.component';

import { WeatherComponent } from './components/weather/weather.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    UsersComponent,
    UpdateProfileComponent,
    UserProfileComponent,
    HomeComponent,
    UsersComponent,
    WorkspaceComponent,
    AllTaskComponent,
    CreateListEntryComponentComponent,
    SingleTaskComponent,
    ListForDayComponentComponent,
    EditItemComponent,
    CalendarComponent,
    HederComponent,
    WeatherComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    CommonModule,
    MatToolbarModule,
    MatProgressBarModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatCardModule,
    MatDialogModule,
  ],
  providers: [
    WINDOW_PROVIDERS,
    JwtHelperService,
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
