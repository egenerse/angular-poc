import { Component, input } from '@angular/core';

@Component({
  selector: '[appTriangle]',
  standalone: true,
  template: `
    <svg:g>
      <polygon [attr.points]="points()" [attr.fill]="fill()"></polygon>
      @if(text()) {
      <text
        [attr.x]="textX()"
        [attr.y]="textY()"
        fill="#000"
        style="font-size: 14px"
      >
        {{ text() }}
      </text>

      }@if(isEditable()) {
      <foreignObject
        [attr.x]="textX() - 20"
        [attr.y]="textY() - 15"
        width="50"
        height="30"
      >
        <input
          type="text"
          [value]="text()"
          style="width: 100%; height: 100%; font-size: 14px; border: none; outline: none; padding: 0; box-sizing: border-box;"
        />
      </foreignObject>
      }
    </svg:g>
  `,
  styles: [],
})
export class TriangleDirective {
  points = input.required<string>(); // Points for the triangle
  fill = input.required<string>(); // Fill color
  text = input(''); // Optional text
  isEditable = input(false); // Enable input fields
  textX = input(0); // X-coordinate for the text
  textY = input(0); // Y-coordinate for the text
}
