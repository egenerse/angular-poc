import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { BoxDirective } from './directives/box.directive';
import { TriangleDirective } from './directives/triangle.directive';
import { CanvasElement } from '../canvas-element/canvas-element.interface';
import { ElementsStore } from '../store/elements.store';
import { JsonPipe, NgStyle } from '@angular/common';
import { DraggableElementDirective } from './directives/draggable-element.directive';
import { CanvasPanningDirective } from './directives/canvas-panning.directive';

@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [
    BoxDirective,
    TriangleDirective,
    DraggableElementDirective,
    CanvasPanningDirective,
    JsonPipe
  ],
  template: `
    <!-- [ngStyle]="{ 'touch-action': activeElement ? 'none' : 'auto' }" -->

    <!-- (pointerup)="onCanvasPointerUp($event)"
    (pointerdown)="onCanvasPointerDown($event)" -->
    <p>
      
      {{ activeElement | json }}
    </p>
    <div appCanvasPanning #canvas >
      <div (pointerup)="onCanvasPointerUp($event)">
      
      <svg width="2000" height="2000" >
        @for (element of this.store.elements(); track element.id) {
        <!-- (pointerdown)="onPointerDown($event, element)" -->
        <g [attr.transform]="'translate(' + element.x + ',' + element.y + ')'">
          @if (element.type === 'box') {
          <g
          class="element"
            appDraggableElement
            (setActiveElement)="setActiveElement($event)"
            appBox
            [activeElement] = "activeElement"
            [element]="element"
            [x]="0"
            [y]="0"
            [width]="100"
            [height]="100"
            [fill]="'#007acc'"
            [text]="'Box'"
            [isEditable]="true"
          ></g>
          } @else {
          <g             appDraggableElement

          (setActiveElement)="setActiveElement($event)"

            [activeElement] = "activeElement"
            [element]="element"

          appTriangle [points]="'50,0 100,100 0,100'" [fill]="'#ff5722'"></g>
          }
        </g>
        }
      </svg>
    </div>
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
  activeElement: CanvasElement | null = null;

  ngAfterViewInit() {
    this.updateCanvasPosition();
  }

  private updateCanvasPosition() {
    if (this.canvasRef) {
      this.canvasPosition =
        this.canvasRef.nativeElement.getBoundingClientRect();
    }
  }

  setActiveElement(element: CanvasElement | null) {
    this.activeElement = element;
  }

  onCanvasPointerUp(event: PointerEvent) {
    event.preventDefault();
    event.stopPropagation();
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
}
