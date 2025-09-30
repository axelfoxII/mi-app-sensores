import { CommonModule } from '@angular/common';
import { Component, NgZone } from '@angular/core';

/**
 * Componente que controla una "bolita" que se mueve con los sensores de movimiento del dispositivo.
 */
@Component({
  selector: 'app-sensor-demo',       // Nombre del componente para usar en HTML
  imports: [CommonModule],           // Importa módulos necesarios (ngIf, pipes, etc.)
  templateUrl: './sensor-demo.html', // HTML del componente
  styleUrls: ['./sensor-demo.css']   // CSS del componente
})
export class SensorDemo {

  // Valores de aceleración del dispositivo
  accX = 0;
  accY = 0;
  accZ = 0;

  // Posición actual de la bolita en la pantalla
  posX = 0;
  posY = 0;

  // Indica si los sensores fueron activados
  sensorActive = false;

  // NgZone permite actualizar la UI cuando los eventos vienen de fuera de Angular
  constructor(private zone: NgZone) {}

  /**
   * Solicita permiso para acceder a los sensores de movimiento en dispositivos iOS.
   * En Android/otros, inicia los sensores directamente.
   */
  async requestPermission() {
    this.sensorActive = true; // Indicamos que el usuario activó sensores

    // Revisamos si el dispositivo necesita permiso explícito (iOS)
    if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
      try {
        const response = await (DeviceMotionEvent as any).requestPermission();

        if (response === 'granted') {
          this.startSensors(); // Permiso concedido, iniciamos sensores
        } else {
          alert("Permiso denegado en iOS");
        }
      } catch (err) {
        console.error(err);
        alert("Error al pedir permisos en iOS");
      }
    } 
    // Si no necesita permiso, pero soporta sensores
    else if ('DeviceMotionEvent' in window) {
      this.startSensors();
    } 
    // Si el dispositivo no soporta sensores
    else {
      alert("Tu dispositivo no soporta sensores de movimiento 😢");
    }
  }

  /**
   * Inicia la lectura de los sensores de movimiento y actualiza la posición de la bolita.
   */
  startSensors() {
    // Posicionamos la bolita inicialmente en el centro de la pantalla
    this.posX = window.innerWidth / 2 - 25; // 25 = mitad del ancho de la bolita
    this.posY = window.innerHeight / 2 - 25; // 25 = mitad del alto de la bolita

    const factor = 5; // Multiplicador para aumentar el efecto del sensor

    // Escuchamos el evento devicemotion del navegador
    window.addEventListener('devicemotion', (event) => {
      // Usamos NgZone para que Angular detecte cambios y actualice la UI
      this.zone.run(() => {

        // Guardamos la aceleración incluyendo la gravedad
        this.accX = event.accelerationIncludingGravity?.x || 0;
        this.accY = event.accelerationIncludingGravity?.y || 0;
        this.accZ = event.accelerationIncludingGravity?.z || 0;

        // Actualizamos la posición de la bolita según la aceleración
        this.posX += this.accX * factor;
        this.posY += this.accY * factor;

        // Definimos límites para que la bolita no se salga de la pantalla
        const maxX = window.innerWidth - 50; // 50 = ancho de la bolita
        const maxY = window.innerHeight - 50; // 50 = alto de la bolita
        const minX = 0;
        const minY = 0;

        // Limitamos posX y posY usando Math.max y Math.min
        this.posX = Math.max(minX, Math.min(maxX, this.posX));
        this.posY = Math.max(minY, Math.min(maxY, this.posY));
      });
    });
  }
}
