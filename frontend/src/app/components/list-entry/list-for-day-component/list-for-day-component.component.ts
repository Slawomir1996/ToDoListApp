import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable, of, switchMap, tap } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { EditItemComponent } from '../edit-item/edit-item.component';
import { PageEvent } from '@angular/material/paginator';
import { ListEntriesPageableByTitle } from '../../../models/list-entry.dto';
import { ListService } from '../../../services/list-service/list.service';
import { AuthenticationService } from '../../../services/authentication-service/authentication.service';
import { WINDOW } from 'src/app/window-token';


@Component({
  selector: 'app-list-for-day-component',
  templateUrl: './list-for-day-component.component.html',
  styleUrls: ['../list.base.scss']

})
export class ListForDayComponentComponent implements OnInit {
  title: string | null = this.route.snapshot.paramMap.get('title')
  dataSource: Observable<ListEntriesPageableByTitle> = this.activatedRoute.params.pipe(switchMap((params: Params) => {
    const title: string = params['title'];
    return this.listService.paginateByTitle(title, 1, 10).pipe();
  }))
  imagePath: string = './img/IMG_20240220_045626_preview_rev_1.png';
  form: FormGroup | any;
  @Input() listEntries?: ListEntriesPageableByTitle;
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
  ) { }
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
    let page = event.pageIndex + 1;
    let limit = event.pageSize;
    this.dataSource = this.listService.paginateByTitle(String(this.title), page, limit)
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
}
