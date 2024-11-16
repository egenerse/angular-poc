import {
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { BoxDirective } from './directives/box.directive';
import { TriangleDirective } from './directives/triangle.directive';
import {
  CanvasElement,
  ElementType,
} from '../canvas-element/canvas-element.interface';
import { ElementsStore } from '../store/elements.store';

@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [BoxDirective, TriangleDirective],
  template: `
    <div class="canvas" (pointerup)="onCanvasPointerUp($event)" #canvas>
      <svg width="2000" height="2000">
        @for (element of this.store.elements(); track element.id) {
        <g
          [attr.transform]="'translate(' + element.x + ',' + element.y + ')'"
          (pointerdown)="onElementPointerDown($event, element)"
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
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLDivElement>;

  readonly store = inject(ElementsStore);
  private canvasPosition: DOMRect | null = null;
  private activeElement: CanvasElement | null = null;

  ngAfterViewInit() {
    console.log('this.store', this.store.elements());
    this.updateCanvasPosition();
  }

  private updateCanvasPosition() {
    if (this.canvasRef) {
      this.canvasPosition =
        this.canvasRef.nativeElement.getBoundingClientRect();
    }
  }

  onCanvasPointerUp(event: PointerEvent) {
    this.updateCanvasPosition();

    if (this.canvasPosition && !this.activeElement && this.store.draggedElementType()) {
      const x = event.clientX - this.canvasPosition.left;
      const y = event.clientY - this.canvasPosition.top;
      this.store.addElement({ x, y });
    } else {
      this.activeElement = null;
    }
  }

  onElementPointerDown(event: PointerEvent, element: CanvasElement) {
    this.activeElement = element;
  }
}
