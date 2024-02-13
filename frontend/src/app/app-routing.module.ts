import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { AllTaskComponent } from "./components/list-entry/all-lists-entries/all-task.component";
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { UpdateProfileComponent } from './components/update-profile/update-profile.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { UsersComponent } from './components/users/users.component';
import { WorkspaceComponent } from './components/workspace/workspace.component';
import { AuthGuard } from './guards/auth.guard';
import { CreateListEntryComponentComponent } from './components/list-entry/create-list-entry-component/create-list-entry-component.component';
import { SingleTaskComponent } from './components/list-entry/complete-lists/single-task.component';
import { ListForDayComponentComponent } from './components/list-entry/list-for-day-component/list-for-day-component.component';



const routes: Routes = [
  { path: 'admin', component: AdminComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'workspace', component: WorkspaceComponent, canActivate: [AuthGuard] },
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
    path: 'list-entries/id/:id',
    component: SingleTaskComponent,
    canActivate: [AuthGuard]

  },
  {
    path: 'list-entries/title/:title',
    component: ListForDayComponentComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'list-entries/title/:title/id/:id',
    component: SingleTaskComponent,
    canActivate: [AuthGuard]

  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'all',
    component: AllTaskComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'add-new',
    component: CreateListEntryComponentComponent,
    canActivate: [AuthGuard]
  },

  // {
  //   path:'',
  //   redirectTo: '/workspace',
  //   pathMatch:'full'
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
