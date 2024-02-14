import { Component, OnInit } from '@angular/core';
import { ListEntriesPageable } from 'src/app/models/list-entry.dto';
import { Router, ActivatedRoute, Data } from '@angular/router';


@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss']
})
export class WorkspaceComponent implements OnInit {

  dataSource: ListEntriesPageable | any = null;
  filterValue: string | any;

  constructor(
    private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
  }

  navigateTo(title: Date) {
    this.router.navigate(['/list-entries/title/'+ title], { relativeTo: this.activatedRoute });
  }
  

}

// userId: number,title:string, page: number, limit: number
