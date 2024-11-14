import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  template: `
    <div class="sidebar">
      @for (element of elements; track element.label) {
        <div class="element" (pointerdown)="startDrag(element.type)">
          {{ element.label }}
        </div>
      }
    </div>
  `,
  styles: [
    `
      .sidebar {
        width: 200px;
        background-color: #f4f4f4;
        padding: 10px;
      }
      .element {
        margin: 5px;
        padding: 10px;
        background-color: #ddd;
        cursor: grab;
      }
    `,
  ],
})
export class SidebarComponent {
  @Output() elementDrag = new EventEmitter<string>();

  elements = [
    { label: 'Box', type: 'box' },
    { label: 'Triangle', type: 'triangle' },
  ];

  startDrag(elementType: string) {
    this.elementDrag.emit(elementType);
  }
}
