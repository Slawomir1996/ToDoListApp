import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Subscription } from 'rxjs';
import { UserDtO } from 'src/app/models/user.dto';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit, OnDestroy {
userId: number|any = null
private sub?:Subscription;
user: UserDtO|any=null

  constructor(
    private activateRoute: ActivatedRoute,
    private userService:UserService
  ) { }

  ngOnInit(): void {
    this.sub=this.activateRoute.params.subscribe(params=>{
      this.userId= parseInt(params['id']);
      this.userService.findOne(this.userId).pipe(map((user:UserDtO)=> this.user=user)).subscribe()
    })
  }

  ngOnDestroy(){
    this.sub?.unsubscribe();
  }
}
