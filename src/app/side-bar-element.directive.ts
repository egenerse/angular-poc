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
    this.highlight('green');
  }

  @HostListener('touchstart') onTouchstart() {
    console.log('touchstart');
    this.store.setDraggedElementType(this.elementType());
    this.highlight('green');
  }
  @HostListener('mouseleave') onMouseLeave() {
    console.log('mouseleave');
    this.highlight('');
  }

  private highlight(color: string) {
    this.el.nativeElement.style.backgroundColor = color;
  }
}
