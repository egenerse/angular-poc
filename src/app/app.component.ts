import { Component, HostListener, inject } from '@angular/core';
import { CanvasComponent } from './canvas/canvas.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ElementsStore } from './store/elements.store';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SidebarComponent, CanvasComponent],
  providers: [ElementsStore],
  template: `
    <div class="container">
      <app-sidebar />
      <div class="canvas-container">
        <app-canvas />
      </div>
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
    `,
  ],
})
export class AppComponent {}
