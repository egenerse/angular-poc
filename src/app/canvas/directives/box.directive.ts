import { Directive, Input, Renderer2, ElementRef, OnInit } from '@angular/core';

@Directive({
  selector: '[appBox]',
  standalone: true,
})
export class BoxDirective implements OnInit {
  @Input() x = 0;
  @Input() y = 0;
  @Input() width = 100;
  @Input() height = 100;
  @Input() fill = '#007acc';

  constructor(private renderer: Renderer2, private host: ElementRef) {}

  ngOnInit() {
    const rect = this.renderer.createElement('rect', 'svg');
    this.renderer.setAttribute(rect, 'x', this.x.toString());
    this.renderer.setAttribute(rect, 'y', this.y.toString());
    this.renderer.setAttribute(rect, 'width', this.width.toString());
    this.renderer.setAttribute(rect, 'height', this.height.toString());
    this.renderer.setAttribute(rect, 'fill', this.fill);

    this.renderer.appendChild(this.host.nativeElement, rect);
  }
}
