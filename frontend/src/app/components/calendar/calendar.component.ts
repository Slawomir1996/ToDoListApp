import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WINDOW } from 'src/app/window-token';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  selected?: Date | null

  calendarData?:string
  constructor( private router: Router,
   
    private activatedRoute: ActivatedRoute,
    @Inject(WINDOW) private window: Window,) { }

  ngOnInit(): void {
    // window.location.reload();
  }
  navigateTo(selected: any) {
    
    
    if(Number(this.selected?.getMonth())<=9){
      if(Number(this.selected?.getDate())<=9){
        this.calendarData = `${this.selected?.getFullYear()}-0${Number(this.selected?.getMonth())+1}-0${this.selected?.getDate()}`
      } else{this.calendarData = `${this.selected?.getFullYear()}-0${Number(this.selected?.getMonth())+1}-${this.selected?.getDate()}`
    }
      

    }
    else{
      if(Number(this.selected?.getDate())<=9){
        this.calendarData = `${this.selected?.getFullYear()}-${Number(this.selected?.getMonth())+1}-0${this.selected?.getDate()}`
      } else{this.calendarData = `${this.selected?.getFullYear()}-${Number(this.selected?.getMonth())+1}-${this.selected?.getDate()}`
    }
  }
    console.log(this.calendarData);
    ;
    this.router.navigate(['/list-entries/title/'+ this.calendarData], { relativeTo: this.activatedRoute });
    // window.location.reload();
  }

}
