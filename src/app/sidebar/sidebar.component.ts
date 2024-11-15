import { Component, EventEmitter, Output, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  template: `
    <div class="sidebar">
      @for (element of elements; track element.label) {
      <div [id]="'sidebar-' + element.type" class="element">
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
export class SidebarComponent implements AfterViewInit {
  @Output() startSidebarElementDrag = new EventEmitter<string | null>();

  elements = [
    { label: 'Box', type: 'box' },
    { label: 'Triangle', type: 'triangle' },
  ];

  ngAfterViewInit(): void {
    // Initialization logic here
    const sidebarBox = document.getElementById('sidebar-box');
    const sidebarTriangle = document.getElementById('sidebar-triangle');

    console.log(' sidebarBox', sidebarBox);
    console.log(' sidebarTriangle', sidebarTriangle);
    console;
    if (sidebarBox) {
      sidebarBox.addEventListener(
        'mousedown',
        (e) => {
          e.preventDefault();
          this.startDrag('box');
        },
        false
      );
      sidebarBox.addEventListener(
        'touchstart',
        (e) => {
          e.preventDefault();
          this.startDrag('box');
        },
        false
      );
      // sidebarBox.addEventListener('mouseup', () => this.startDrag(null), false);
    }
    if (sidebarTriangle) {
      sidebarTriangle.addEventListener(
        'mousedown',
        (e) => {
          e.preventDefault();
          this.startDrag('triangle');
        },
        false
      );
      sidebarTriangle.addEventListener(
        'touchstart',
        (e) => {
          e.preventDefault();
          this.startDrag('triangle');
        },
        false
      );
      // sidebarTriangle.addEventListener(
      //   'touchend',
      //   () => this.startDrag(null),
      //   false
      // );
      // sidebarTriangle.addEventListener(
      //   'touchcancel',
      //   () => this.startDrag(null),
      //   false
      // );
    }
  }

  startDrag(elementType: string | null) {
    console.log('startDrag', elementType);
    this.startSidebarElementDrag.emit(elementType);
  }
}
