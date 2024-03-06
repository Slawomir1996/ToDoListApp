import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

import { EditItemComponent } from '../edit-item/edit-item.component';
import { FormGroup } from '@angular/forms';
import { ListEntriesPageable } from '../../../models/list-entry.dto';
import { ListService } from '../../../services/list-service/list.service';
import { WINDOW } from '../../../window-token';
import { AuthenticationService } from '../../../services/authentication-service/authentication.service';


@Component({
  selector: 'app-task',
  templateUrl: './all-task.component.html',
  styleUrls: ['../list.base.scss']
})
export class AllTaskComponent implements OnInit {

  dataSource: Observable<ListEntriesPageable> = this.listService.indexAll(1, 10)

  form: FormGroup | any;
  formBuilder: any;
  taskId: string | any

  @Input() listEntries?: ListEntriesPageable;
  @Output() paginate: EventEmitter<PageEvent> = new EventEmitter<PageEvent>();
  pageEvent?: PageEvent;
  origin = this.window.location.origin;
  constructor(
    private listService: ListService,
    private router: Router,
    @Inject(WINDOW) private window: Window,
    private authService: AuthenticationService,
    private dialogRef: MatDialog

  ) { }
  ngOnInit(): void {
  }

  onPaginateChange(event: PageEvent) {
    let page = event.pageIndex;
    let limit = event.pageSize;

    page = page + 1;

    this.dataSource = this.listService.indexAll(page, limit)
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
      // console.log(updatedEntry);
    });

  }




}