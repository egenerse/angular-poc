import {
  Directive,
  ElementRef,
  HostListener,
  inject,
} from '@angular/core';
import { ElementsStore } from '../../../store/elements.store';
import { ElementType } from '../../../shared/canvas-element.interface';

@Directive({
  selector: '[appCanvasPanning]',
  standalone: true,
})
export class CanvasPanningDirective {
  private startX = 0;
  private startY = 0;
  private initialScrollLeft = 0;
  private initialScrollTop = 0;

  constructor(private el: ElementRef<HTMLDivElement>) {}
  store = inject(ElementsStore);

  @HostListener('pointerdown', ['$event'])
  onPointerDown(event: PointerEvent) {
    console.log('DEBUG: CanvasPanningDirective pointer down');
    if (!this.isPannableArea(event)) return;

    console.log('DEBUG: CanvasPanningDirective pointer down in pannable area');

    this.startX = event.clientX;
    this.startY = event.clientY;
    this.initialScrollLeft = this.el.nativeElement.scrollLeft;
    this.initialScrollTop = this.el.nativeElement.scrollTop;

    document.addEventListener('pointermove', this.onPointerMove);
    document.addEventListener('pointerup', this.onPointerUp);
    return false;
  }

  private onPointerMove = (event: PointerEvent): void => {
    if (!this.isPannableArea(event)) return;

    const deltaX = event.clientX - this.startX;
    const deltaY = event.clientY - this.startY;
    this.el.nativeElement.scrollLeft = this.initialScrollLeft - deltaX;
    this.el.nativeElement.scrollTop = this.initialScrollTop - deltaY;
  };

  private onPointerUp = (): void => {
    console.log('DEBUG: Removing pointermove listener');
    document.removeEventListener('pointermove', this.onPointerMove);
    document.removeEventListener('pointerup', this.onPointerUp);
  };

  private isPannableArea(event: PointerEvent): boolean {
    return !(event.target as HTMLElement).closest('.element');
  }
}
