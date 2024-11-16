import { Component, input } from '@angular/core';
import { BoxChildComponent } from '../../components/box-child.component';

@Component({
  selector: '[appBox]',
  standalone: true,
  imports: [BoxChildComponent],
  template: `
    <svg:g>
      <rect
        [attr.x]="x()"
        [attr.y]="y()"
        [attr.width]="width()"
        [attr.height]="height()"
        [attr.fill]="fill()"
      ></rect>
      <text
        [attr.x]="x() + 10"
        [attr.y]="y() + 30"
        fill="#000"
        style="font-size: 14px"
      >
        {{ text() }}
      </text>
      @if((isEditable())) {
      <foreignObject
        [attr.x]="x() + 10"
        [attr.y]="y() + 10"
        [attr.width]="width() - 20"
        height="30"
      >
        <app-box-child />
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
export class BoxDirective {
  x = input.required<number>();
  y = input.required<number>();
  width = input.required<number>();
  height = input.required<number>();
  fill = input.required<string>();
  text = input(''); // Optional text
  isEditable = input(false); // Enable input fields
}
