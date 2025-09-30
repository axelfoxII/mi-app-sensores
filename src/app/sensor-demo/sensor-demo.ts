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

  posX = 0;
  posY = 0;

  velX = 0; // velocidad para inercia
  velY = 0;

  sensorActive = false;

  constructor(private zone: NgZone) {}

  async requestPermission() {
    this.sensorActive = true;

    if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
      try {
        const response = await (DeviceMotionEvent as any).requestPermission();
        if (response === 'granted') this.startSensors();
        else alert("Permiso denegado en iOS");
      } catch {
        alert("Error al pedir permisos en iOS");
      }
    } else if ('DeviceMotionEvent' in window) {
      this.startSensors();
    } else {
      alert("Tu dispositivo no soporta sensores de movimiento 😢");
    }
  }

  startSensors() {
    this.posX = window.innerWidth / 2 - 25;
    this.posY = window.innerHeight / 2 - 25;

    const factor = 0.2; // influencia del sensor
    const damping = 0.95; // fricción para inercia

    window.addEventListener('devicemotion', (event) => {
      this.zone.run(() => {
        const ax = event.accelerationIncludingGravity?.x || 0;
        const ay = event.accelerationIncludingGravity?.y || 0;

        this.accX = ax;
        this.accY = ay;

        // actualizar velocidad
        this.velX += ax * factor;
        this.velY += ay * factor;
      });
    });

    const step = () => {
      // aplicar velocidad con inercia
      this.posX += this.velX;
      this.posY += this.velY;

      // rebote en los bordes
      const maxX = window.innerWidth - 50;
      const maxY = window.innerHeight - 50;
      const minX = 0;
      const minY = 0;

      if (this.posX < minX) { this.posX = minX; this.velX *= -0.5; }
      if (this.posX > maxX) { this.posX = maxX; this.velX *= -0.5; }
      if (this.posY < minY) { this.posY = minY; this.velY *= -0.5; }
      if (this.posY > maxY) { this.posY = maxY; this.velY *= -0.5; }

      // aplicar fricción
      this.velX *= damping;
      this.velY *= damping;

      requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }
}
