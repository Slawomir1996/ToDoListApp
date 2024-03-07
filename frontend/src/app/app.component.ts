import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './services/authentication-service/authentication.service';
import { JWT_NAME } from './services/authentication-service/authentication.service'


@Component({
  selector: 'app-root',

  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'frontend';

  constructor(
    private router: Router, private authService: AuthenticationService,
  ) {}

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
