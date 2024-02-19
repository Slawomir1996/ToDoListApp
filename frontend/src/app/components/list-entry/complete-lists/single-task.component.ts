import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params } from '@angular/router';
import { map, Observable, switchMap, tap } from 'rxjs';
import {  ListEntry } from 'src/app/models/list-entry.dto';
import { ListService } from 'src/app/services/list-service/list.service';
import { WINDOW } from 'src/app/window-token';
import { EditItemComponent } from '../edit-item/edit-item.component';
import { DeleteListItemComponent } from '../../delete-list-item/delete-list-item.component';

@Component({
  selector: 'app-single-task',
  templateUrl: './single-task.component.html',
  styleUrls: ['./single-task.component.scss']
})
export class SingleTaskComponent implements OnInit {
  
  form: FormGroup | any;
  formBuilder: any;
  taskId:string|any
  constructor(
    private activatedRoute: ActivatedRoute,
    private listService: ListService, @Inject(WINDOW) private window: Window,
    private dialogRef:MatDialog) { 
      
    }
  origin = this.window.location.origin;

   

  listEntry$: Observable<ListEntry> = this.activatedRoute.params.pipe(
    switchMap((params: Params) => {
      const listEntryId: number =parseInt( params['id']);

      return this.listService.findOne(listEntryId).pipe(
        map((listEntry: ListEntry) =>  listEntry)
      )
    })
  )
  
  ngOnInit() {
   
  }
  
  
  openDailog(){
    this.taskId = this.activatedRoute.snapshot.paramMap.get('id')
    console.log(this.taskId)
    
    this.dialogRef.open(EditItemComponent,{
      disableClose: true,
      data:{
      id: Number(this.taskId)
        
      }
      
    })
  }
  
  deleteItem() {
    this.taskId = this.activatedRoute.snapshot.paramMap.get('id')
    console.log(this.taskId)
    
    this.dialogRef.open(DeleteListItemComponent,{
      disableClose: true,
      data:{
      id: Number(this.taskId)
        
      }
      
    })
  }
}
