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
        appSideBarElement
        [elementType]="element.type"
      >
        {{ element.label }}
      </div>
      }
    </div>
    <div>{{ store.draggedElementType() }}</div>
  `,
  styles: [
    `
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
}
