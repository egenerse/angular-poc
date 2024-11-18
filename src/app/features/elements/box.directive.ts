import { Component, input } from '@angular/core';
import { BoxChildComponent } from '../../components/box-child.component';

@Component({
  selector: '[appBox]',
  standalone: true,
  imports: [BoxChildComponent],
  template: `
    <svg:g>
      <rect
        [attr.width]="width()"
        [attr.height]="height()"
        [attr.fill]="fill()"
      ></rect>
      <text [attr.x]="10" [attr.y]="30" fill="#000" style="font-size: 14px">
        {{ text() }}
      </text>
      @if((isEditable())) {
      <foreignObject
        [attr.x]="10"
        [attr.y]="40"
        [attr.width]="width() - 20"
        height="30"
      >
        <input
          type="text"
          [value]="'inputfield'"
          style="font-size: 14px; border: none; outline: none; padding: 0; box-sizing: border-box;"
        />
      </foreignObject>
      }
      <app-box-child />
    </svg:g>
  `,
  styles: [],
})
export class BoxDirective {
  width = input.required<number>();
  height = input.required<number>();
  fill = input.required<string>();
  text = input(''); // Optional text
  isEditable = input(false); // Enable input fields
}
