import { CommonModule } from '@angular/common';
import { Component, NgZone } from '@angular/core';

@Component({
  selector: 'app-sensor-demo',
  imports: [CommonModule],
  templateUrl: './sensor-demo.html',
  styleUrls: ['./sensor-demo.css']
})
export class SensorDemo {
  accX = 0;
  accY = 0;
  accZ = 0;

  posX = 0; // offset desde el centro
  posY = 0;

  sensorActive = false;

  constructor(private zone: NgZone) {}

  async requestPermission() {
    // Activamos el mensaje inmediatamente
    this.sensorActive = true;

    // iOS 13+ requiere permiso explícito
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
    // Inicializamos la bolita en el centro (offset 0)
    this.posX = 0;
    this.posY = 0;

    const factor = 5; // velocidad de movimiento

    // Usamos NgZone para que Angular detecte cambios de variables
    window.addEventListener('devicemotion', (event) => {
      this.zone.run(() => {
        this.accX = event.accelerationIncludingGravity?.x || 0;
        this.accY = event.accelerationIncludingGravity?.y || 0;
        this.accZ = event.accelerationIncludingGravity?.z || 0;

        // Actualizamos posición
        this.posX += this.accX * factor;
        this.posY += this.accY * factor;

        // Limitar movimiento para no salirse de la pantalla
        const maxX = window.innerWidth / 2 - 25; // 25 = mitad de la bola
        const maxY = window.innerHeight / 2 - 25;
        this.posX = Math.max(-maxX, Math.min(maxX, this.posX));
        this.posY = Math.max(-maxY, Math.min(maxY, this.posY));
      });
    });
  }
}
