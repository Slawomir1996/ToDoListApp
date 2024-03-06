import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable, switchMap, tap } from 'rxjs';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatDialog } from '@angular/material/dialog';
import { EditItemComponent } from '../edit-item/edit-item.component';
import { PageEvent } from '@angular/material/paginator';

import { ListEntriesPageable } from '../../../models/list-entry.dto';
import { ListService } from '../../../services/list-service/list.service';

import { AuthenticationService } from '../../../services/authentication-service/authentication.service';


@Component({
  selector: 'app-list-for-day-component',
  templateUrl: './list-for-day-component.component.html',
  styleUrls: ['../list.base.scss']

})
export class ListForDayComponentComponent implements OnInit {
  dataSource: Observable<ListEntriesPageable> = this.activatedRoute.params.pipe(switchMap((params: Params) => {
    const title: string = params['title'];
    return this.listService.findByTitle(title).pipe();
  }))
  imagePath: string = './img/IMG_20240220_045626_preview_rev_1.png'
  form: FormGroup | any
  @Input() listEntries?: ListEntriesPageable;
  @Output() paginate: EventEmitter<PageEvent> = new EventEmitter<PageEvent>();
  pageEvent?: PageEvent;

  constructor(
    private activatedRoute: ActivatedRoute,
    private listService: ListService,
    private formBuilder: FormBuilder,
    private authService: AuthenticationService, private dialogRef: MatDialog, private route: ActivatedRoute
  ) { }



  listByTitle$: Observable<ListEntriesPageable> = this.activatedRoute.params.pipe(switchMap((params: Params) => {
    const title: string = params['title'];
    console.log(title);
    return this.listService.findByTitle(title).pipe();
  }))

  ngOnInit(): void {
    this.listByTitle$
    this.route.params.subscribe(params => {
      // window.location.reload();
      this.form = this.formBuilder.group({
        id: [{ value: null, disabled: true }],
        slug: [null, { disabled: true }],
        title: [this.route.snapshot.paramMap.get('title')],
        body: [null, [Validators.required]],
        startAt: [null],
        isDone: [false, [Validators.required]]


      })

      this.authService.isAuthenticated()

    });
  }
  onPaginateChange(event: PageEvent) {
    let page = event.pageIndex;
    let limit = event.pageSize;

    page = page + 1;

    this.dataSource = this.listService.indexAll(page, limit)
  }

  add() {
    this.listService.post(this.form?.getRawValue()).pipe(
      // tap(() => this.router.navigate([``]))
    ).subscribe();
    window.location.reload();
  }
  delete(id: number | any) {
    return this.listService.delete(Number(id)).pipe(
      tap(() => window.location.reload())).subscribe();

  }
  openDailog(taskId: number | any) {

    this.dialogRef.open(EditItemComponent, {
      disableClose: true,
      data: {
        id: Number(taskId)
      }
    })
  }

  statusChange(listEntries: any) {
    listEntries.isDone = !listEntries.isDone;
    this.listService.updateOne(listEntries).subscribe(updatedEntry => {

    });

  }



}
