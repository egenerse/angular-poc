import { Component } from '@angular/core';
import { CanvasComponent } from './canvas/canvas.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { CanvasElement } from './canvas-element/canvas-element.interface';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SidebarComponent, CanvasComponent],
  template: `
    <div class="container">
      <app-sidebar
        (startSidebarElementDrag)="onStartSidebarElementDrag($event)"
      ></app-sidebar>
      <div class="canvas-container">
        <app-canvas
          [elements]="elements"
          (onElementAdded)="onElementAdded($event)"
          (elementMoved)="onElementMoved($event)"
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
        background-color: #eaeaea; /* Light background for contrast */
      }
    `,
  ],
})
export class AppComponent {
  elements: CanvasElement[] = [
    { type: 'box', x: 277.01171875, y: 169.76953125, id: 1731667437104 },
  ];
  private draggedElementType: string | null = null;

  onStartSidebarElementDrag(elementType: string | null) {
    this.draggedElementType = elementType;
  }

  onElementAdded(position: { x: number; y: number }) {
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
      console.log('this.elements', this.elements);
    }
  }

  onElementMoved = (event: { id: number; x: number; y: number }) => {
    this.elements = this.elements.map((element) =>
      element.id === event.id ? { ...element, x: event.x, y: event.y } : element
    );
  };
}
