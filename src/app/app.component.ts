import { Component } from '@angular/core';
import { SidebarComponent } from './sidebar/sidebar.component';
import { CanvasComponent } from './canvas/canvas.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SidebarComponent, CanvasComponent],
  template: `
    <div class="container">
      <app-sidebar (startSidebarElementDrag)="onElementDrag($event)"></app-sidebar>
      <div class="canvas-container">
        <app-canvas
          [elements]="elements"
          (elementDrop)="onElementDrop($event)"
        ></app-canvas>
      </div>
    </div>
  `,
  styles: [
    `
      .container {
        display: flex;
        height: 100vh;
        overflow: hidden;
      }
      app-sidebar {
        position: fixed;
        width: 50px;
        height: 100%;
        left: 0;
        top: 0;
        background-color: #f4f4f4;
      }
      .canvas-container {
        margin-left: 50px; /* Offset to the right of the fixed sidebar */
        flex: 1;
        overflow: auto; /* Make canvas scrollable independently */
      }
      app-canvas {
        width: 2000px;
        height: 2000px;
      }
    `,
  ],
})
export class AppComponent {
  elements: any[] = [];
  private draggedElementType: string | null = null;

  onElementDrag(elementType: string | null) {
    this.draggedElementType = elementType;
  }

  onElementDrop(position: { x: number; y: number }) {

    console.log('Element dropped at', position);
    console.log('this.draggedElementType', this.draggedElementType);
    if (this.draggedElementType) {
      this.elements = [
        ...this.elements,
        {
          type: this.draggedElementType,
          x: position.x,
          y: position.y,
          id: Date.now(),
        },
      ];
      this.draggedElementType = null;
    }
  }
}
