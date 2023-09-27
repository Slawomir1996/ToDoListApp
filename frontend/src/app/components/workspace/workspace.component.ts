import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Title } from '@angular/platform-browser';
import { map, Observable, switchMap, tap } from 'rxjs';
import { ListEntriesPageable } from 'src/app/models/list-entry.dto';
import { UserDtO } from 'src/app/models/user.dto';
import { AuthenticationService } from 'src/app/services/authentication-service/authentication.service';
import { ListService } from 'src/app/services/list-service/list.service';
import { UserService } from 'src/app/services/user/user.service';
import { Router, ActivatedRoute, Data } from '@angular/router';


@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss']
})
export class WorkspaceComponent implements OnInit {

  dataSource: ListEntriesPageable | any = null;
  filterValue: string | any;

  constructor(private listService: ListService, private authService: AuthenticationService,
    private userService: UserService,
    private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
  }

  navigateTo(title: Date) {
    this.router.navigate(['/list-entries/title/'+ title], { relativeTo: this.activatedRoute });
  }
  

}

// userId: number,title:string, page: number, limit: number
