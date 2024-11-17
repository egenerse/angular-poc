import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { throttle } from 'lodash';
import { BoxDirective } from './directives/box.directive';
import { TriangleDirective } from './directives/triangle.directive';
import { CanvasElement } from '../canvas-element/canvas-element.interface';
import { ElementsStore } from '../store/elements.store';

@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [BoxDirective, TriangleDirective],
  template: `
    <div (pointerup)="onCanvasPointerUp($event)" #canvas
    style="touch-action: none;">
    >
      <svg width="2000" height="2000"  [attr.transform]="'scale( 1.1,1.1)'" >
        @for (element of this.store.elements(); track element.id) {
        <g
          [attr.transform]="'translate(' + element.x + ',' + element.y + ')'"
          (pointerdown)="onPointerDown($event, element)"
        >
          @if (element.type === 'box') {
          <g
            appBox
            [x]="0"
            [y]="0"
            [width]="100"
            [height]="100"
            [fill]="'#007acc'"
            [text]="'Box'"
            [isEditable]="true"
          ></g>
          } @else {
          <g appTriangle [points]="'50,0 100,100 0,100'" [fill]="'#ff5722'"></g>
          }
        </g>
        }
      </svg>
    </div>
  `,
  styles: [
    `
      svg {
        background-color: #f9f9f9;
      }
    `,
  ],
})
export class CanvasComponent {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLDivElement>;

  readonly store = inject(ElementsStore);
  private canvasPosition: DOMRect | null = null;
  private activeElement: CanvasElement | null = null;

  constructor() {
    // Bind throttled method
    this.updateElementPosition = throttle(this.updateElementPosition, 40);
  }

  ngAfterViewInit() {
    this.updateCanvasPosition();
  }

  private updateCanvasPosition() {
    if (this.canvasRef) {
      this.canvasPosition = this.canvasRef.nativeElement.getBoundingClientRect();
    }
  }

  onCanvasPointerUp(event: PointerEvent) {
    this.updateCanvasPosition();

    if (
      this.canvasPosition &&
      !this.activeElement &&
      this.store.draggedElementType()
    ) {
      const x = event.clientX - this.canvasPosition.left;
      const y = event.clientY - this.canvasPosition.top;
      this.store.addElement({ x, y });
    } else {
      this.activeElement = null;
    }
  }

  onPointerDown(event: PointerEvent, element: CanvasElement) {
    event.preventDefault();
    (event.target as HTMLElement).setPointerCapture(event.pointerId);
  
    this.activeElement = element;
    this.updateCanvasPosition();
  
    // Use document for global event handling
    document.addEventListener('pointermove', this.onPointerMove);
    document.addEventListener('pointerup', this.onPointerUp);
  }
  
  private onPointerUp = () => {
    this.activeElement = null;
    document.removeEventListener('pointermove', this.onPointerMove);
    document.removeEventListener('pointerup', this.onPointerUp);
  };


  private onPointerMove = (event: PointerEvent) => {

    event.preventDefault();
    if (this.activeElement && this.canvasPosition) {

      console.log('Pointer onPointerMove', event);
      const x = event.clientX - this.canvasPosition.left;
      const y = event.clientY - this.canvasPosition.top;

      // Use throttled method for updating position
      this.updateElementPosition(x, y);
    }
  };

  private updateElementPosition(x: number, y: number) {
    if (this.activeElement) {
      this.store.moveElement({ id: this.activeElement.id, x, y });
    }
  }
}
