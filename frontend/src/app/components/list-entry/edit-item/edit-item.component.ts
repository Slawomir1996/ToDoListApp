import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { map, tap } from 'rxjs';
import { ListEntry } from 'src/app/models/list-entry.dto';

import { ListService } from 'src/app/services/list-service/list.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { Title } from 'chart.js';


@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.scss']
})
export class EditItemComponent implements OnInit {
  form: FormGroup | any;

  constructor(private formBuilder: FormBuilder,
    private listService: ListService,
    @Inject(MAT_DIALOG_DATA) public data: { id: number },
    private router: Router, private dialogRef: MatDialog) { }

  ngOnInit(): void {
    console.log(this.data.id);
    this.form = this.formBuilder.group({
      id: [{ value: this.data.id, disabled: true }, [Validators.required]],
      title: [null, [Validators.required]],
      body: [null, [Validators.required]],
      startAt: [null],
      isDone: [null]
    });

    this.listService.findOne(this.data.id).pipe(
      map((listEntry: ListEntry) => listEntry)
    ).pipe(
      tap((task: ListEntry) => {
        this.form.patchValue({
          id: task.id,
          title: task.title,
          body: task.body,
          isDone: task.isDone,
          startAt: task.startAt
        })
      })).subscribe()
  }

  update() {
    console.log(this.form.getRawValue());
    this.listService.updateOne(this.form.getRawValue()).pipe(
      tap(() => this.router.navigate(['/workspace']))

    ).subscribe();
    this.dialogRef.closeAll()
    location.reload();


  }
  clouse() {
    this.dialogRef.ngOnDestroy()
  }
}
