import {
  Component,
  EventEmitter,
  Output,
  AfterViewInit,
  inject,
} from '@angular/core';
import { SideBarElementDirective } from '../side-bar-element.directive';
import { ElementType } from '../canvas-element/canvas-element.interface';
import { ElementsStore } from '../store/elements.store';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [SideBarElementDirective],
  template: `
    <div class="sidebar">
      @for (element of elements; track element.label) {
      <div
        [id]="'sidebar-' + element.type"
        class="element"
        [appSideBarElement]="element.type"
      >
        {{ element.label }}
      </div>
      }
    </div>
    <div>{{ store.draggedElementType() }}</div>
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
  readonly store = inject(ElementsStore);

  elements = [
    { label: 'Box', type: ElementType.Box },
    { label: 'Triangle', type: ElementType.Triangle },
  ];

  // Initialization logic here
  // if (sidebarBox) {
  //   sidebarBox.addEventListener(
  //     'mousedown',
  //     (e) => {
  //       e.preventDefault();
  //       this.startDrag(ElementType.Box);
  //     },
  //     false
  //   );
  //   sidebarBox.addEventListener(
  //     'touchstart',
  //     (e) => {
  //       e.preventDefault();
  //       this.startDrag(ElementType.Box);
  //     },
  //     false
  //   );
  //   // sidebarBox.addEventListener('mouseup', () => this.startDrag(null), false);
  // }
  // if (sidebarTriangle) {
  //   sidebarTriangle.addEventListener(
  //     'mousedown',
  //     (e) => {
  //       e.preventDefault();
  //       this.startDrag(ElementType.Triangle);
  //     },
  //     false
  //   );
  //   sidebarTriangle.addEventListener(
  //     'touchstart',
  //     (e) => {
  //       e.preventDefault();
  //       this.startDrag(ElementType.Triangle);
  //     },
  //     false
  //   );
  //   // sidebarTriangle.addEventListener(
  //   //   'touchend',
  //   //   () => this.startDrag(null),
  //   //   false
  //   // );
  //   // sidebarTriangle.addEventListener(
  //   //   'touchcancel',
  //   //   () => this.startDrag(null),
  //   //   false
  //   // );
  // }
}
