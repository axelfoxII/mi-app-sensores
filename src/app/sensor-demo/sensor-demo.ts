import { CommonModule } from '@angular/common';
import { Component, NgZone } from '@angular/core';

@Component({
  selector: 'app-sensor-demo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sensor-demo.html',
  styleUrls: ['./sensor-demo.css']
})
export class SensorDemo {
  accX = 0;
  accY = 0;
  accZ = 0;

  posX = 0; // posición absoluta
  posY = 0;

  sensorActive = false;

  constructor(private zone: NgZone) {}

  async requestPermission() {
    this.sensorActive = true;

    if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
      try {
        const response = await (DeviceMotionEvent as any).requestPermission();
        if (response === 'granted') {
          this.startSensors();
        } else {
          alert("Permiso denegado en iOS");
        }
      } catch (err) {
        console.error(err);
        alert("Error al pedir permisos en iOS");
      }
    } else if ('DeviceMotionEvent' in window) {
      this.startSensors();
    } else {
      alert("Tu dispositivo no soporta sensores de movimiento 😢");
    }
  }

  startSensors() {
    // Partir desde el centro
    this.posX = window.innerWidth / 2 - 25; // 25 = mitad de la bola
    this.posY = window.innerHeight / 2 - 25;

    const factor = 5; // velocidad de movimiento

    window.addEventListener('devicemotion', (event) => {
      this.zone.run(() => {
        this.accX = event.accelerationIncludingGravity?.x || 0;
        this.accY = event.accelerationIncludingGravity?.y || 0;
        this.accZ = event.accelerationIncludingGravity?.z || 0;

        // Actualizamos posición
        this.posX += this.accX * factor;
        this.posY += this.accY * factor;

        // Limitar para no salirse de la pantalla
        const maxX = window.innerWidth - 50;
        const maxY = window.innerHeight - 50;
        const minX = 0;
        const minY = 0;

        this.posX = Math.max(minX, Math.min(maxX, this.posX));
        this.posY = Math.max(minY, Math.min(maxY, this.posY));
      });
    });
  }
}
