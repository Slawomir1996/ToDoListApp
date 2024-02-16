import { Component, OnInit } from '@angular/core';
import { ListEntriesPageable } from 'src/app/models/list-entry.dto';
import { Router, ActivatedRoute, Data } from '@angular/router';
import { ListService } from 'src/app/services/list-service/list.service';
import { AuthenticationService } from 'src/app/services/authentication-service/authentication.service';
import { UserService } from 'src/app/services/user/user.service';



@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss']
})
export class WorkspaceComponent implements OnInit {
  ngOnInit(): void {
  }

 
  

}

