export enum ElementType {
    Box = 'box',
    Circle = 'circle',
    Triangle = 'triangle',
  }

export interface CanvasElement {
    type: ElementType;
    x: number;
    y: number;
    id: number;
  }
  