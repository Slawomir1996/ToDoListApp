import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable, switchMap, tap } from 'rxjs';
import { ListEntriesPageable } from 'src/app/models/list-entry.dto';
import { AuthenticationService } from 'src/app/services/authentication-service/authentication.service';
import { ListService } from 'src/app/services/list-service/list.service';
import { WINDOW } from 'src/app/window-token';



@Component({
  selector: 'app-create-list-entry-component',
  templateUrl: './create-list-entry-component.component.html',
  styleUrls: ['./create-list-entry-component.component.scss']
})
export class CreateListEntryComponentComponent implements OnInit {

  form: FormGroup | any
  selected?: Date | null

  calendarData?: string


  constructor(
    private formBuilder: FormBuilder,
    private listService: ListService,
    private authService: AuthenticationService,
    private router: Router,
    @Inject(WINDOW) private window: Window,
    private activatedRoute: ActivatedRoute,
  ) { }


  listByTitle$: Observable<ListEntriesPageable> = this.activatedRoute.params.pipe(switchMap((params: Params) => {
    const title: string = params['title'];
    console.log(title);
    return this.listService.findByTitle(title).pipe(tap(a => console.log(a)));
  }))


  ngOnInit(): void {
    this.calendarData = `${this.selected?.getDate()}'-'${this.selected?.getMonth()}'-'${this.selected?.getFullYear()}`

    console.log(this.selected);

    this.form = this.formBuilder.group({

      id: [{ value: null, disabled: true }],
      slug: [null, { disabled: true }],
      title: [, [Validators.required]],
      body: [null, [Validators.required]],
      isDone: [false, [Validators.required]]


    })

    this.authService.isAuthenticated()
  }

  add() {

    this.listService.post(this.form?.getRawValue(this.form.patchValue({ title: this.calendarData }))).pipe(
      tap(() => this.router.navigate(['../home']))
    ).subscribe({});
  }

}

