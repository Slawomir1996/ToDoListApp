import { Component } from '@angular/core';
import { Router} from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication-service/authentication.service';
import { JWT_NAME } from 'src/app/services/authentication-service/authentication.service';


@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss']
})
export class WorkspaceComponent  {
  constructor(
    private router: Router, private authService: AuthenticationService,){}
     navigateTo(value: string) {
      this.router.navigate(['../', value]);
    }
 
  isLoggedIn(): boolean {
    return !!localStorage.getItem(JWT_NAME); // Sprawdzenie obecności tokenu JWT w localStorage
  }

}

