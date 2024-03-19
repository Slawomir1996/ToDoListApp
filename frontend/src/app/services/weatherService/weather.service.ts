import { Injectable } from '@angular/core';



const newLocal = '52a6a452687bbaeb84760aa72a48aae0';
@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  async getWeatherData(city: string) {
    const apiKey: string = newLocal;

    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error('Could not fetch weather data');
    }

    const clonedResponse = response.clone(); // Utwórz kopię ciała odpowiedzi

    try {
      const weatherData = await clonedResponse.json(); // Odczytaj dane w formacie JSON z kopii odpowiedzi
      return weatherData;
    } catch (error) {
      throw new Error('Error while parsing response JSON');
    }

  }
}
