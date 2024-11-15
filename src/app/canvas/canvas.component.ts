import { Component, Input, Output, EventEmitter, HostListener, ElementRef } from '@angular/core';

interface CanvasElement {
  type: string;
  x: number;
  y: number;
  id: number;
}

@Component({
  selector: 'app-canvas',
  standalone: true,
  template: `
    <div class="canvas" (pointerup)="onCanvasPointerUp($event)" >
      <svg width="2000" height="2000">
        @for (element of elements; track element.id) {
          <g
            [attr.transform]="'translate(' + element.x + ',' + element.y + ')'"
            (pointerdown)="onElementPointerDown($event, element)"
          >
            @if (element.type === 'box') {
              <rect width="100" height="100" fill="#007acc"></rect>
            } @else {
              <polygon points="50,0 100,100 0,100" fill="#ff5722"></polygon>
            }
          </g>
        }
      </svg>
    </div>
  `,
  styles: [
    `
      .canvas {
        flex: 1;
        border: 1px solid #ccc;
        position: relative;
        overflow: auto;
      }
      svg {
        background-color: #f9f9f9;
      }
    `,
  ],
})
export class CanvasComponent {
  @Input() elements: CanvasElement[] = [];
  @Output() elementDrop = new EventEmitter<{ x: number; y: number }>();
  
  private activeElement: CanvasElement | null = null;
  private offsetX = 0;
  private offsetY = 0;

  constructor(private el: ElementRef) {}

  onCanvasPointerUp(event: PointerEvent) {
    console.log('Canvas pointer up', event);
    if (!this.activeElement) {
      const rect = this.el.nativeElement.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      this.elementDrop.emit({ x, y });
    } else {
      this.activeElement = null;
    }
    this.el.nativeElement.style.cursor = 'default';
  }

  onElementPointerDown(event: PointerEvent, element: CanvasElement) {
    event.preventDefault(); // Prevents scrolling on pointer down
    this.activeElement = element;
    this.offsetX = event.clientX - element.x;
    this.offsetY = event.clientY - element.y;
    this.el.nativeElement.style.cursor = 'grabbing';
  }

  @HostListener('pointermove', ['$event'])
  onPointerMove(event: PointerEvent) {
    console.log('Pointer move', event);
    if (this.activeElement) {
      event.preventDefault(); // Prevents scrolling on pointer move
      this.activeElement.x = event.clientX - this.offsetX;
      this.activeElement.y = event.clientY - this.offsetY;
    }
    return false;
  }
}
