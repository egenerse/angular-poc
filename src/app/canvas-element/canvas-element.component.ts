import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
  ViewEncapsulation,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import { CanvasElement } from './canvas-element.interface';

@Component({
  selector: 'app-canvas-element',
  standalone: true,
  template: `
    <g
      [attr.transform]="'translate(' + element.x + ',' + element.y + ')'"
      (pointerdown)="onPointerDown($event)"
    >
      @if (element.type === 'box') {
      <rect width="100" height="100" fill="#007acc"></rect>
      } @else {
      <polygon points="50,0 100,100 0,100" fill="#ff5722"></polygon>
      }
    </g>
  `,
  encapsulation: ViewEncapsulation.None,
  schemas: [NO_ERRORS_SCHEMA],
})
export class CanvasElementComponent {
  @Input() element!: CanvasElement;
  @Output() elementMoved = new EventEmitter<{
    id: number;
    x: number;
    y: number;
  }>();

  private isDragging = false;
  private offsetX = 0;
  private offsetY = 0;

  onPointerDown(event: PointerEvent) {
    event.preventDefault();
    this.isDragging = true;
    this.offsetX = event.clientX - this.element.x;
    this.offsetY = event.clientY - this.element.y;
  }

  @HostListener('document:pointermove', ['$event'])
  onPointerMove(event: PointerEvent) {
    if (this.isDragging) {
      event.preventDefault();
      const x = event.clientX - this.offsetX;
      const y = event.clientY - this.offsetY;
      this.elementMoved.emit({ id: this.element.id, x, y });
    }
  }

  @HostListener('document:pointerup', ['$event'])
  onPointerUp() {
    this.isDragging = false;
  }
}
