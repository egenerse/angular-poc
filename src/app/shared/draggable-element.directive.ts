import {
  Directive,
  ElementRef,
  HostListener,
  inject,
  input,
  OnDestroy,
  output,
} from '@angular/core';
import { throttle } from 'lodash-es';
import { CanvasElement } from './canvas-element.interface';
import { ElementsStore } from '../store/elements.store';


@Directive({
  selector: '[appDraggableElement]',
  standalone: true,
})
export class DraggableElementDirective implements OnDestroy {
  element = input.required<CanvasElement>();
  activeElement = input<CanvasElement | null>();
  setActiveElement = output<CanvasElement | null>();

  private store = inject(ElementsStore);
  private canvasPosition!: DOMRect;
  private offsetX = 0;
  private offsetY = 0;

  private throttledMouseMove: (event: MouseEvent) => void;
  private throttledTouchMove: (event: TouchEvent) => void;

  constructor(private el: ElementRef) {
    this.throttledMouseMove = throttle(this.onMouseMove.bind(this), 30);
    this.throttledTouchMove = throttle(this.onTouchMove.bind(this), 30);
  }

  ngOnDestroy() {
    this.cleanupGlobalListeners();
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    console.log('DEBUG: DraggableElementDirective onMouseDown');
    event.preventDefault();
    this.initializeDrag(event.clientX, event.clientY);
    document.addEventListener('mousemove', this.throttledMouseMove);
    console.log('mousemove listener added');
    document.addEventListener('mouseup', this.onMouseUp.bind(this));
    this.store.setSelectedElements([this.element().id]);
    event.stopPropagation();
  }

  private onMouseMove(event: MouseEvent): void {
    console.log('DEBUG: DraggableElementDirective onMouseMove');
    this.handleDrag(event.clientX, event.clientY);
  }

  private onMouseUp(): void {
    this.cleanupDrag();
    document.removeEventListener('mousemove', this.throttledMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp.bind(this));
  }

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent): void {
    const touch = event.touches[0];
    if (!touch) return;
    event.preventDefault();
    this.initializeDrag(touch.clientX, touch.clientY);
    document.addEventListener('touchmove', this.throttledTouchMove);
    document.addEventListener('touchend', this.onTouchEnd.bind(this));
    this.store.setSelectedElements([this.element().id]);
    event.stopPropagation();
  }

  private onTouchMove(event: TouchEvent): void {
    const touch = event.touches[0];
    if (!touch) return;
    this.handleDrag(touch.clientX, touch.clientY);
  }

  private onTouchEnd(): void {
    this.cleanupDrag();
    document.removeEventListener('touchmove', this.throttledTouchMove);
    document.removeEventListener('touchend', this.onTouchEnd.bind(this));
  }

  private initializeDrag(clientX: number, clientY: number): void {
    this.setActiveElement.emit(this.element());

    // Get the closest SVG canvas
    const canvas = this.el.nativeElement.closest('svg') as SVGElement;
    this.canvasPosition = canvas?.getBoundingClientRect() ?? null;

    // Get element's bounding box
    const boundingBox = this.getBoundingBox();

    // Calculate offset from the cursor to the element's top-left corner
    this.offsetX = clientX - boundingBox.x;
    this.offsetY = clientY - boundingBox.y;
  }

  private getBoundingBox(): { x: number; y: number } {
    const element = this.el.nativeElement;

    // Try to use getBoundingClientRect
    const rect = element.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      return {
        x: rect.left,
        y: rect.top,
      };
    }

    // Fallback to getBBox for SVG elements
    const svgElement = element.querySelector(
      'polygon, rect, circle'
    ) as SVGGraphicsElement;
    const bbox = svgElement?.getBBox();
    if (bbox) {
      return {
        x: bbox.x,
        y: bbox.y,
      };
    }

    console.warn('Could not calculate bounding box for element.');
    return { x: 0, y: 0 };
  }

  private handleDrag(clientX: number, clientY: number): void {
    if (!this.canvasPosition) return;

    const x = clientX - this.canvasPosition.left - this.offsetX;
    const y = clientY - this.canvasPosition.top - this.offsetY;

    // Update the element's position in the store
    this.store.moveElement({ id: this.element().id, x, y });
  }

  private cleanupDrag(): void {
    this.setActiveElement.emit(null);
  }

  private cleanupGlobalListeners(): void {
    document.removeEventListener('mousemove', this.throttledMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp.bind(this));
    document.removeEventListener('touchmove', this.throttledTouchMove);
    document.removeEventListener('touchend', this.onTouchEnd.bind(this));
  }
}
