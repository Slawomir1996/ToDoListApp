import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { ListEntriesPageable } from 'src/app/models/list-entry.dto';
import { AuthenticationService } from 'src/app/services/authentication-service/authentication.service';

import { ListService } from 'src/app/services/list-service/list.service';
import { WINDOW } from 'src/app/window-token';
import { EditItemComponent } from '../edit-item/edit-item.component';
import { FormGroup } from '@angular/forms';


@Component({
  selector: 'app-task',
  templateUrl: './all-task.component.html',
  styleUrls: ['./all-task.component.scss']
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
      console.log(updatedEntry);
    });

  }




}
