import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WeatherService } from 'src/app/services/weatherService/weather.service';
import { WINDOW } from 'src/app/window-token';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  selected?: Date | null

  calendarData?:string
  constructor(
     private router: Router,
    private activatedRoute: ActivatedRoute,
    @Inject(WINDOW) private window: Window,
    private weatherService:WeatherService) { }

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
//weather 
  city: string | any = null;
  temp:number= 0;
  humidity:number=0;
  description:string='';
  weatherId:number=0;
  displayStyle: string = 'none';

  async onSubmit(event: Event) {
    if (this.city !== '') {
      try {
        const weatherData = await this.weatherService.getWeatherData(this.city);
        this.displayWeatherInfo(weatherData);
        this.displayStyle = 'block';
      } catch (error) {
        console.error(error);
        // this.displayError(error);
      }
    } else {
      this.displayError('Please enter a city');
    }
  }

 

  displayWeatherInfo(data: any) {
    const{name:city, 
      main:{temp,humidity},
      weather:[{description, id}]}= data;
 
  this.city=  data.name;
  this.temp=  data.main.temp;
  this.humidity= data.main.humidity;
  this.description=data.weather[0].description;
  this.weatherId= data.weather[0].id
  console.log(typeof(id));
  }

  getWeatherEmoji(id:number) {
    
    switch (true) {
      case (id>=200&& id<300):
          
      return "⛈️";
      case (id>=300&& id<500):
          
      return "🌧️";
      case (id>=500&& id<600):
          
      return "🌧️";
      case (id>=600&& id<700):
          
      return "❄️";
      case (id>=700&& id<800):
          
      return "🌫️";
      case (id==800):
          
      return "☀️";
      case (id>=801&& id<810):
          
      return "☁️";
     default:
      return '❓'
      
  }
  }

  displayError(message: string) {
    // Kod funkcji displayError pozostaje bez zmian
  }
}
