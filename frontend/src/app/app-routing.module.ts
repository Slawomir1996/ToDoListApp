import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { AllTaskComponent } from "./components/list-entry/all-lists-entries/all-task.component";
import { LoginComponent } from './components/forms/login/login.component';
import { RegisterComponent } from './components/forms/register/register.component';
import { UpdateProfileComponent } from './components/forms/update-profile/update-profile.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { UsersComponent } from './components/users/users.component';
import { WorkspaceComponent } from './components/workspace/workspace.component';
import { AuthGuard } from './guards/auth.guard';
import { ListForDayComponentComponent } from './components/list-entry/list-for-day-component/list-for-day-component.component';
import { UpdatePasswordComponent } from './components/forms/update-password/updatePassword.component';
import { CalendarComponent } from './components/calendar/calendar.component';




const routes: Routes = [
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard] },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'workspace', component: WorkspaceComponent },
  { path: 'updatePassword', component: UpdatePasswordComponent },
  {
    path: 'users',
    children: [
      {
        path: '',
        component: UsersComponent,
        canActivate: [AuthGuard]
      },
      {
        path: ':id',
        component: UserProfileComponent,
        canActivate: [AuthGuard]
      },
    ]
  },


  {
    path: 'update-profile',
    component: UpdateProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'list-entries/title/:title',
    component: ListForDayComponentComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'all',
    component: AllTaskComponent,
    canActivate: [AuthGuard]
  },


  {
    path: '',
    redirectTo: '/workspace',
    pathMatch: 'full'
  },
  {
    path: 'calendary',
    component: CalendarComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
