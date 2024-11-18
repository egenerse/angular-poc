import { Component } from '@angular/core';
import { CanvasComponent } from './features/canvas/canvas.component';
import { ElementsStore } from './store/elements.store';
import { SidebarComponent } from './features/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SidebarComponent, CanvasComponent],
  providers: [ElementsStore],
  template: `
    <div class="container">
      <app-sidebar class="sidebar" />
      <app-canvas class="canvas" />
    </div>
  `,
  styles: [
    `
      .container {
        display: flex;
        height: 100vh;
        overflow: hidden;
        background-color: #eaeaea; /* Light background for contrast */
      }

      .sidebar {
        width: 150px; /* Fixed width for sidebar */
        height: 100%; /* Full height */
        background-color: #f4f4f4; /* Sidebar background */
        overflow-y: auto; /* Add scrolling if content exceeds height */
        box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1); /* Slight shadow for separation */
      }

      .canvas {
        flex: 1; /* Take the remaining space */
        position: relative; /* Positioning for child elements */
        overflow: auto; /* Allow scrolling for larger diagrams */
        border: 1px solid #ccc; /* Optional: Border around the canvas */
        background-color: #f9f9f9; /* Canvas background */
      }
    `,
  ],
})
export class AppComponent {}
