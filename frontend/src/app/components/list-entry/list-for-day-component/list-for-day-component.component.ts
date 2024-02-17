import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Data, Params, Router } from '@angular/router';
import { map, Observable, switchMap, tap } from 'rxjs';
import { ListEntriesPageable } from 'src/app/models/list-entry.dto';
import { ListService } from 'src/app/services/list-service/list.service';
import { WINDOW } from 'src/app/window-token';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication-service/authentication.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-list-for-day-component',
  templateUrl: './list-for-day-component.component.html',
  styleUrls: ['./list-for-day-component.component.scss']
})
export class ListForDayComponentComponent implements OnInit {
  
  form: FormGroup|any
  constructor(
    private activatedRoute: ActivatedRoute,
    private listService: ListService, @Inject(WINDOW) private window: Window, 
    private formBuilder: FormBuilder,
    private authService: AuthenticationService, private router: Router, private route: ActivatedRoute
    ) { }
    origin = this.window.location.origin;
    
    
    listByTitle$:Observable<ListEntriesPageable>= this.activatedRoute.params.pipe(switchMap((params:Params)=>{
      const title:string= params['title'];
      console.log(title);
      return this.listService.findByTitle(title).pipe(tap (a=>console.log(a )));
    }))
    
    ngOnInit(): void {
      this.listByTitle$
      this.route.params.subscribe(params => {
        // window.location.reload();
        this.form = this.formBuilder.group({
        id: [{value: null, disabled: true}],
        slug: [null, {disabled: true}],
        title: [this.route.snapshot.paramMap.get('title')],
        body: [null, [Validators.required]],
        isDone: [false, [Validators.required]]
        
        
      })
      
      this.authService.isAuthenticated()
      
      
      
      
    });
    }
    
    add() {
      this.listService.post(this.form?.getRawValue( )).pipe(
        // tap(() => this.router.navigate([``]))
        ).subscribe();
        window.location.reload();
      }
   
   
    
      
}
