import { Component } from '@angular/core';
import { SidebarComponent } from './sidebar/sidebar.component';
import { CanvasComponent } from './canvas/canvas.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SidebarComponent, CanvasComponent],
  template: `
    <div class="container">
      <app-sidebar (elementDrag)="onElementDrag($event)"></app-sidebar>
      <app-canvas [elements]="elements" (elementDrop)="onElementDrop($event)"></app-canvas>
    </div>
  `,
  styles: [`
    .container {
      display: flex;
      height: 100vh;
    }
  `]
})
export class AppComponent {
  elements: any[] = [];
  private draggedElementType: string | null = null;

  onElementDrag(elementType: string) {
    this.draggedElementType = elementType;
  }

  onElementDrop(position: { x: number; y: number }) {
    if (this.draggedElementType) {
      this.elements = [
        ...this.elements,
        { type: this.draggedElementType, x: position.x, y: position.y, id: Date.now() }
      ];
      this.draggedElementType = null;
    }
  }
}
