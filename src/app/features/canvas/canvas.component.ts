import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { CanvasElement } from '../../shared/canvas-element.interface';
import { ElementsStore } from '../../store/elements.store';
import { JsonPipe } from '@angular/common';
import { CanvasPanningDirective } from './directives/canvas-panning.directive';
import { DraggableElementDirective } from '../../shared/draggable-element.directive';
import { BoxDirective } from '../elements/box.directive';
import { TriangleDirective } from '../elements/triangle.directive';

@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [
    BoxDirective,
    TriangleDirective,
    DraggableElementDirective,
    CanvasPanningDirective,
    JsonPipe,
  ],
  template: `
    @if(activeElement) {
    <p
      [style.position]="'absolute'"
      [style.left.px]="0"
      [style.top.px]="0"
    >
      {{ activeElement | json }}
    </p>
    }
    <div appCanvasPanning #canvas>
      <div (pointerup)="onCanvasPointerUp($event)">
        <svg width="2000" height="2000">
          @for (element of this.store.elements(); track element.id) {
          <g
            [attr.transform]="'translate(' + element.x + ',' + element.y + ')'"
          >
            @if (element.type === 'box') {
            <g
              class="element"
              appBox
              appDraggableElement
              [activeElement]="activeElement"
              [element]="element"
              [width]="100"
              [height]="100"
              [fill]="'#007acc'"
              [text]="'Box'"
              [isEditable]="true"
              (setActiveElement)="setActiveElement($event)"
            ></g>
            } @else {
            <g
              class="element"
              appTriangle
              appDraggableElement
              [activeElement]="activeElement"
              [element]="element"
              [points]="'50,0 100,100 0,100'"
              [fill]="'#ff5722'"
              (setActiveElement)="setActiveElement($event)"
            ></g>
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
