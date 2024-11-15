import { Directive, Input, Renderer2, ElementRef, OnInit } from '@angular/core';

@Directive({
  selector: '[appTriangle]',
  standalone: true,
})
export class TriangleDirective implements OnInit {
  @Input() points = '50,0 100,100 0,100';
  @Input() fill = '#ff5722';

  constructor(private renderer: Renderer2, private host: ElementRef) {}

  ngOnInit() {
    const polygon = this.renderer.createElement('polygon', 'svg');
    this.renderer.setAttribute(polygon, 'points', this.points);
    this.renderer.setAttribute(polygon, 'fill', this.fill);

    this.renderer.appendChild(this.host.nativeElement, polygon);
  }
}
