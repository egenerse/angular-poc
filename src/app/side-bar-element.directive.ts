import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostListener,
  inject,
  input,
} from '@angular/core';
import { ElementType } from './canvas-element/canvas-element.interface';
import { ElementsStore } from './store/elements.store';

@Directive({
  selector: '[appSideBarElement]',
  standalone: true,
})
export class SideBarElementDirective implements AfterViewInit {
  elementType = input.required<ElementType>();
  readonly store = inject(ElementsStore);

  constructor(private el: ElementRef) {
    this.el.nativeElement.style.cursor = 'grab';
  }

  ngAfterViewInit(): void {
    console.log('side-bar-element directive after view');
  }

  @HostListener('mousedown') onMouseDown() {
    console.log('Mouse down:' + this.elementType());
    this.store.setDraggedElementType(this.elementType());

    return false;
  }

  @HostListener('touchstart') onTouchstart(e: TouchEvent) {
    console.log('touchstart');
    this.store.setDraggedElementType(this.elementType());
  }

  @HostListener('touchend') onTouchEnd(e: TouchEvent) {
    console.log('touchend: ', e);
    this.store.setDraggedElementType(this.elementType());
  }

  @HostListener('mouseleave') onMouseLeave() {
    console.log('mouseleave');
  }
}
