import { Component } from '@angular/core';

@Component({
  selector: 'app-box-child',
  standalone: true,
  template: `
    <div>
      <p>test from child to render in svg</p>
    </div>
  `,
})
export class BoxChildComponent {}
