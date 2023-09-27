import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors, FormControl, ControlContainer } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication-service/authentication.service';
import { Router } from '@angular/router';
import { map, max, min } from 'rxjs/operators';

class CustomValidators {
    static passwordContainsNumber(control: AbstractControl): ValidationErrors | null {
        const regex = /\d/;
        console.log(control.errors);

        if (regex.test(control.value) && control.value !== null) {
            return null;
        } else {
            return { passwordvalid: false };
        }
    }
    static passwordContainsLettrr(control: AbstractControl): ValidationErrors | null {
        const regex = /[a-z]/;
        console.log(control.errors);

        if (regex.test(control.value) && control.value !== null) {
            return null;
        } else {
            return { passwordvalid: false };
        }
    }
    static passwordMatches(console: AbstractControl): ValidationErrors | null {

        const password = console.get('password')?.value;
        const confirmPassword = console.get('confirmPassword')?.value;

        if ((password === confirmPassword) && (password !== '' && confirmPassword !== '')) {
            return null
        } else {
            return { passwordMatching: false }
        }


    }
}

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {


    constructor(
        private authService: AuthenticationService,
        private formBuilder: FormBuilder,
        private router: Router
    ) { }
    registerForm!: FormGroup;

    ngOnInit(): void {
        this.registerForm = this.formBuilder.group({
            name: [null, [Validators.required]],
            username: [null, [Validators.required]],
            email: [null, [
                Validators.required,
                Validators.email,
                Validators.minLength(6)
            ]],
            password: [null, [
                Validators.required,
                Validators.minLength(3),
                CustomValidators.passwordContainsNumber,
                CustomValidators.passwordContainsLettrr

            ]],
            confirmPassword: [null, [Validators.required,
            CustomValidators.passwordMatches]]
        }, {
            validators: CustomValidators.passwordMatches
        })

    }



    onSubmit() {
        if (this.registerForm.invalid) {

            return;

        } console.log(this.registerForm + 'ok');
        this.authService.register(this.registerForm.value).pipe(
            map(user => this.router.navigate(['login']))

        ).subscribe()
        console.log(this.registerForm.value);
    }
    // onSubmit() {
    //     if (this.registerForm.invalid) {
    //         return;
    //     }
    //     console.log(this.registerForm.value);
    //     this.authService.register(this.registerForm.value).pipe(
    //         map(user => this.router.navigate(['login']))
    //     ).subscribe()
    // }



}
