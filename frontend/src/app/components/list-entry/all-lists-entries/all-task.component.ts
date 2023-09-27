import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Observable } from 'rxjs';
import { ListEntriesPageable } from 'src/app/models/list-entry.dto';

import { ListService } from 'src/app/services/list-service/list.service';
import { WINDOW } from 'src/app/window-token';


@Component({
  selector: 'app-task',
  templateUrl: './all-task.component.html',
  styleUrls: ['./all-task.component.scss']
})
export class AllTaskComponent implements OnInit {

dataSource: Observable<ListEntriesPageable>= this.listService.indexAll(1,10)

@Input() listEntries?: ListEntriesPageable ;
@Output() paginate: EventEmitter<PageEvent> = new EventEmitter<PageEvent>();
  pageEvent?: PageEvent;
  origin = this.window.location.origin;
  constructor(
    private listService:ListService,
    
    @Inject(WINDOW) private window: Window,
   
    
    ) { }
    ngOnInit(): void {}

    onPaginateChange(event: PageEvent) {
      let page =event.pageIndex;
      let limit = event.pageSize;
      
      page = page + 1;
      
    this.dataSource =this.listService.indexAll(page,limit)
  }

  done(id:number) {
    this.listService.delete(id)
  }

  




  // navigate(title:number) {
  //   this.router.navigateByUrl('list-entries/' + title);
  // }

}
