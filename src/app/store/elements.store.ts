import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { CanvasElement, ElementType } from '../shared/canvas-element.interface';
import { withDevtools } from '@angular-architects/ngrx-toolkit';

type ElementssState = {
  elements: CanvasElement[];
  draggedElementType: ElementType | null;
  selectedElements: number[];
};

const initialState: ElementssState = {
  elements: [
    {
      type: ElementType.Box,
      x: 277.01171875,
      y: 169.76953125,
      id: 1731667437104,
    },
  ],
  selectedElements: [],
  draggedElementType: null,
};

export const ElementsStore = signalStore(
  withDevtools('elements'),
  withState(initialState),
  withMethods((store) => ({
    addElement({ x, y }: { x: number; y: number }): void {
      const type = store.draggedElementType();
      if (type !== null) {
        const newElement: CanvasElement = {
          id: Date.now(),
          x,
          y,
          type,
        };
        patchState(store, (state) => ({
          elements: [...state.elements, newElement],
          draggedElementType: null,
        }));
      }
    },
    setDraggedElementType(draggedElementType: ElementType | null): void {
      patchState(store, (state) => ({
        ...state,
        draggedElementType,
      }));
    },
    setSelectedElements(selectedElements: number[]): void {
      patchState(store, (state) => ({
        ...state,
        selectedElements,
      }));
    },

    moveElement({ id, x, y }: { id: number; x: number; y: number }): void {
      patchState(store, (state) => ({
        ...state,
        elements: state.elements.map((element) =>
          element.id === id
            ? {
                ...element,
                x,
                y,
              }
            : element
        ),
      }));
    },
  }))
);
