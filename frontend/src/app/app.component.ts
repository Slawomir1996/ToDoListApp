import { Component , Renderer2, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './services/authentication-service/authentication.service';
import{JWT_NAME} from './services/authentication-service/authentication.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'frontend';
  private JWT_NAME: string = 'token'; // Przykładowa nazwa klucza dla tokenu JWT w 
  constructor(
    private router: Router, private authService: AuthenticationService,private renderer: Renderer2, private el: ElementRef
    ) { }
    // <mat-form-field style="margin-left: 20px;" name="loginRegisterDropdown" >
    //   <mat-select placeholder="menu">
    //     <mat-option *ngIf="!isLoggedIn()" routerLink="/login">login</mat-option>
    //     <mat-option *ngIf="!isLoggedIn()" routerLink="/register"> Register</mat-option>
    //     <mat-option *ngIf="isLoggedIn()"   routerLink="/update-profile">Admin</mat-option>
    //     <mat-option class="logoutBtn" *ngIf="isLoggedIn()" (click)="logout()">Logout</mat-option>
    //   </mat-select>
    // </mat-form-field>
    
   
  isMenuOpen: boolean = false;
  
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  navigateTo(value: string) {
    this.router.navigate(['../', value]);
    
  }
  isLoggedIn(): boolean {
    return !!localStorage.getItem(JWT_NAME); // Sprawdzenie obecności tokenu JWT w localStorage
  }
  
  logout() {
    this.authService.logout()
    this.router.navigate(['login']);
  }
}
