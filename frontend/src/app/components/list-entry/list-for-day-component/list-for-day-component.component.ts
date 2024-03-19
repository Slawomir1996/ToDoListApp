import { ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable, of, switchMap } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { EditItemComponent } from '../edit-item/edit-item.component';
import { PageEvent } from '@angular/material/paginator';
import { ListEntriesPageable, ListEntry } from '../../../models/list-entry.dto';
import { ListService } from '../../../services/list-service/list.service';
import { AuthenticationService } from '../../../services/authentication-service/authentication.service';
import { WINDOW } from 'src/app/window-token';


@Component({
  selector: 'app-list-for-day-component',
  templateUrl: './list-for-day-component.component.html',
  styleUrls: ['./list-for-day-component.component.scss']
})
export class ListForDayComponentComponent implements OnInit {
  tasks?: ListEntry[] = [];
  selectedStatus: string = 'all';

  dataSource: Observable<ListEntriesPageable> = of({} as ListEntriesPageable);
  form: FormGroup | any;
  @Input() listEntries?: ListEntriesPageable;
  @Output() paginate: EventEmitter<PageEvent> = new EventEmitter<PageEvent>();
  pageEvent?: PageEvent;
  origin = this.window.location.origin;
  currentURL = this.activatedRoute.snapshot.url[0].path;

  constructor(
    private activatedRoute: ActivatedRoute,
    private listService: ListService,
    private formBuilder: FormBuilder,
    @Inject(WINDOW) private window: Window,
    private authService: AuthenticationService,
    private dialogRef: MatDialog,
    private route: ActivatedRoute,
    
  ) {
    this.route.params.subscribe(params => {
      const title: string | null = params['title'];
      if (!title || title === "") {
         this.listService.indexAll(1, 10).subscribe(data => {
          this.tasks = data.items;
          console.log(data);
          
        });
      } else {
         this.route.params.pipe(
          switchMap((params: Params) => {
            const title: string = params['title'];
            return this.listService.paginateByTitle(title, 1, 10)
          })
        ).subscribe(data => {
          this.tasks = data.items;
          console.log(data);
          
        });
      }
    });
  }
  defaultValue: string = '';
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.form = this.formBuilder.group({
        id: [{ value: null, disabled: true }],
        slug: [null, { disabled: true }],
        title: [this.route.snapshot.paramMap.get('title')],
        body: [null, [Validators.required]],
        startAt: [null],
        isDone: [false, [Validators.required]]
      });

      this.authService.isAuthenticated();
    });

  }

  onPaginateChange(event: PageEvent) {
    if (this.activatedRoute.snapshot.paramMap.has('title')) {
      let page = event.pageIndex + 1;
      let limit = event.pageSize;
      this.activatedRoute.params.subscribe(params => {
        const title: string = params['title'];
        this.dataSource = this.listService.paginateByTitle(title, page, limit);
      });
    } else {
      let page = event.pageIndex;
      let limit = event.pageSize;
      page = page + 1;

      this.dataSource = this.listService.indexAll(page, limit);
    }
  }

  addItem() {
    this.listService.post(this.form?.getRawValue()).subscribe(() => {
      window.location.reload();
    });
  }

  deleteItem(id: number | any) {
    this.listService.delete(Number(id)).subscribe(() => {
      window.location.reload();
    });
  }

  openDialog(taskId: number | any) {
    this.dialogRef.open(EditItemComponent, {
      disableClose: true,
      data: {
        id: Number(taskId)
      }
    });
  }

  toggleStatus(listEntry: any) {
    listEntry.isDone = !listEntry.isDone;
    this.listService.updateOne(listEntry).subscribe();
  }

  getStatusText(isDone: boolean): string {
    return !isDone ? 'done' : 'todo';
  }

  setVisibility(item: any): boolean {
    const status = this.getStatusText(item.isDone);
    return this.selectedStatus === "all" || this.selectedStatus === status;
  }

  
 
}