import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable, map, of, switchMap, tap } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { EditItemComponent } from '../edit-item/edit-item.component';
import { PageEvent } from '@angular/material/paginator';
import { ListEntriesPageable, ListEntry } from '../../../models/list-entry.dto';
import { ListService } from '../../../services/list-service/list.service';
import { AuthenticationService } from '../../../services/authentication-service/authentication.service';
import { WINDOW } from 'src/app/window-token';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-list-for-day-component',
  templateUrl: './list-for-day-component.component.html',
  styleUrls: ['./list-for-day-component.component.scss']

})
export class ListForDayComponentComponent implements OnInit {
  selected = 'all';
  selectedStatus: string = 'all'
  dataSource: Observable<ListEntriesPageable> = of({} as ListEntriesPageable);
  currentURL = this.activatedRoute.snapshot.url[0].path;
  form: FormGroup | any;
  @Input() listEntries?: ListEntriesPageable;
  @Output() paginate: EventEmitter<PageEvent> = new EventEmitter<PageEvent>();
  pageEvent?: PageEvent;
  origin = this.window.location.origin;

  constructor(
    private activatedRoute: ActivatedRoute,
    private listService: ListService,
    private formBuilder: FormBuilder,
    @Inject(WINDOW) private window: Window,
    private authService: AuthenticationService,
    private dialogRef: MatDialog,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe(params => {
      const title: string | null = params['title'];
      if (!title || title === "") {
        this.dataSource = this.listService.indexAll(1, 10);
      } else {
        this.dataSource = this.route.params.pipe(
          switchMap((params: Params) => {
            const title: string = params['title'];
            return this.listService.paginateByTitle(title, 1, 10);
          })
        );
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
      
    })

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

  add() {
    this.listService.post(this.form?.getRawValue()).subscribe(() => {
      window.location.reload();
    });
  }

  delete(id: number | any) {
    this.listService.delete(Number(id)).subscribe(() => {
      window.location.reload();
    });
  }

  openDailog(taskId: number | any) {
    this.dialogRef.open(EditItemComponent, {
      disableClose: true,
      data: {
        id: Number(taskId)
      }
    });
  }
  statusChange(listEntries: any) {
    listEntries.isDone = !listEntries.isDone;
    this.listService.updateOne(listEntries).subscribe();
  }
  displayStyle: string = 'none';
  vizible: boolean = false

  checkStatus(isDone: boolean): string {
    return !isDone ? 'done' : 'todo';
  }
  
  setVisibility(item: any): boolean {
    const toDisplay = this.checkStatus(item.isDone);
    return this.selectedStatus === "all" || this.selectedStatus === toDisplay;
  }
 
    
  }
  

