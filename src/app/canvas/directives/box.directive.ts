import {
  Directive,
  Renderer2,
  ElementRef,
  OnInit,
  inject,
  input,
} from '@angular/core';

@Directive({
  selector: '[appBox]',
  standalone: true,
})
export class BoxDirective implements OnInit {
  x = input.required<number>();
  y = input.required<number>();
  width = input.required<number>();
  height = input.required<number>();
  fill = input.required<string>();
  text = input('');
  isEditable = input(false); 

  private renderer = inject(Renderer2);
  private host = inject(ElementRef);

  ngOnInit() {
    const rect = this.renderer.createElement('rect', 'svg');
    this.renderer.setAttribute(rect, 'x', this.x().toString());
    this.renderer.setAttribute(rect, 'y', this.y().toString());
    this.renderer.setAttribute(rect, 'width', this.width().toString());
    this.renderer.setAttribute(rect, 'height', this.height().toString());
    this.renderer.setAttribute(rect, 'fill', this.fill());
    this.renderer.appendChild(this.host.nativeElement, rect);

    if (this.isEditable()) {
      this.addEditableField();
    } else {
      this.addStaticText();
    }
  }

  private addStaticText() {
    const textElement = this.renderer.createElement('text', 'svg');
    const textNode = this.renderer.createText(this.text());
    this.renderer.setAttribute(textElement, 'x', (this.x() + 10).toString());
    this.renderer.setAttribute(textElement, 'y', (this.y() + 30).toString());
    this.renderer.setAttribute(textElement, 'fill', '#000');
    this.renderer.setStyle(textElement, 'font-size', '14px');
    this.renderer.appendChild(textElement, textNode);
    this.renderer.appendChild(this.host.nativeElement, textElement);
  }

  private addEditableField() {
    const foreignObject = this.renderer.createElement('foreignObject', 'svg');
    this.renderer.setAttribute(foreignObject, 'x', (this.x() + 10).toString());
    this.renderer.setAttribute(foreignObject, 'y', (this.y() + 10).toString());
    this.renderer.setAttribute(foreignObject, 'width', (this.width() - 20).toString());
    this.renderer.setAttribute(foreignObject, 'height', '30');

    const inputElement = this.renderer.createElement('input');
    this.renderer.setAttribute(inputElement, 'type', 'text');
    this.renderer.setAttribute(inputElement, 'value', this.text());
    this.renderer.setStyle(inputElement, 'width', '100%');
    this.renderer.setStyle(inputElement, 'height', '100%');
    this.renderer.setStyle(inputElement, 'font-size', '14px');
    this.renderer.setStyle(inputElement, 'border', 'none');
    this.renderer.setStyle(inputElement, 'outline', 'none');
    this.renderer.setStyle(inputElement, 'padding', '0');
    this.renderer.setStyle(inputElement, 'box-sizing', 'border-box');

    this.renderer.appendChild(foreignObject, inputElement);
    this.renderer.appendChild(this.host.nativeElement, foreignObject);
  }
}
