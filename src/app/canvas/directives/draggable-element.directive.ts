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
import { ElementsStore } from '../../store/elements.store';
import { CanvasElement } from '../../canvas-element/canvas-element.interface';

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
    this.throttledMouseMove = throttle(this.onMouseMove.bind(this), 40);
    this.throttledTouchMove = throttle(this.onTouchMove.bind(this), 40);
  }

  ngOnDestroy() {
    this.cleanupGlobalListeners();
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void {
    console.log('DEBUG: DraggableElementDirective onMouseDown');
    event.preventDefault();
    this.initializeDrag(event.clientX, event.clientY);
    document.addEventListener('mousemove', this.throttledMouseMove);
    console.log('mousemove listener added');
    document.addEventListener('mouseup', this.onMouseUp.bind(this));
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
  
    // Get the element's position
    const boundingBox = this.getBoundingBox();
    this.offsetX = clientX - boundingBox.centerX;
    this.offsetY = clientY - boundingBox.centerY;
  }
  
  private getBoundingBox(): { centerX: number; centerY: number } {
    const element = this.el.nativeElement;
  
    // Try to use getBoundingClientRect
    const rect = element.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      return {
        centerX: rect.left + rect.width / 2,
        centerY: rect.top + rect.height / 2,
      };
    }
  
    // Fallback to getBBox for SVG elements
    const svgElement = element.querySelector('polygon, rect, circle') as SVGGraphicsElement;
    const bbox = svgElement?.getBBox();
    if (bbox) {
      return {
        centerX: bbox.x + bbox.width / 2,
        centerY: bbox.y + bbox.height / 2,
      };
    }
  
    console.warn('Could not calculate bounding box for element.');
    return { centerX: 0, centerY: 0 };
  }

  private handleDrag(clientX: number, clientY: number): void {
    console.log('DEBUG: DraggableElementDirective handleDrag');
    if (!this.canvasPosition) return;

    const x = clientX - this.canvasPosition.left - this.offsetX;
    const y = clientY - this.canvasPosition.top - this.offsetY;

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
