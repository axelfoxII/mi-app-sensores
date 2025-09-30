import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SensorDemo } from "./sensor-demo/sensor-demo";

@Component({
  selector: 'app-root',
  imports: [SensorDemo],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('sensormovil');
}
