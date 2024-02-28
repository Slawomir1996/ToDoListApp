import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { map, switchMap, tap } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication-service/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  registerExpanded = false;
  forgottenPasswordExpanded= false
  constructor(
    private authService: AuthenticationService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email, Validators.minLength(6)]),
      password: new FormControl(null, [Validators.required, Validators.minLength(3)])
    })
  }
  
  onSubmit() {
    if (this.loginForm.invalid) {
      
      return;
    }
    this.authService.login(this.loginForm.value).pipe(
      switchMap(token => this.authService.checkIsTempPasswordActive().pipe(
        tap(isTempPasswordActive => {
          if (isTempPasswordActive) {
            this.router.navigate(['updatePassword']); // Redirect to update password page
          } else {
            this.router.navigate(['workspace']); // Redirect to workspace
          }
        })
      ))
    ).subscribe();
  }




}