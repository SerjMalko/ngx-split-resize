import { Directive, ElementRef, Inject, Input, OnInit, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export type DirectionType = 'right' | 'left' | 'top' | 'bottom';

export enum AxisTypeEnum {
  X = 'x',
  Y = 'y',
}

export enum DirectionTypeEnum {
  RIGHT  = 'right',
  LEFT   = 'left',
  TOP    = 'top',
  BOTTOM = 'bottom'
}

@Directive({
  selector: '[resizable]'
})
export class ResizableDirective implements OnInit {

  @Input() rDirections: DirectionType;
  @Input() rFlex: boolean;

  flexBasis;
  widthElement;
  heightElement;
  startInfo;
  axis;

  constructor(private elementRef: ElementRef, private render: Renderer2, @Inject(DOCUMENT) private document: Document) {
    this.flexBasis = this.getFlexBaseName();
  }

  ngOnInit() {
    this.addResizerToElements();
  }

  dragging(e) {
    let prop;
    let offset;
    let currentValue;

    const sign = (this.rDirections === DirectionTypeEnum.TOP || this.rDirections === DirectionTypeEnum.LEFT) ? 1 : -1;

    if (this.axis === AxisTypeEnum.X) {
      offset = this.startInfo - e.clientX;
      prop = this.rFlex ? this.flexBasis : 'width';
      currentValue = this.widthElement + sign * (offset) + 'px';
    } else {
      offset = this.startInfo - e.clientY;
      prop = this.rFlex ? this.flexBasis : 'height';
      currentValue = this.heightElement + sign * (offset) + 'px';
    }

    this.render.setStyle(this.elementRef.nativeElement, prop, currentValue);
  }

  private getFlexBaseName() {
    return 'flexBasis' in this.document.documentElement.style ? 'flexBasis' :
      'webkitFlexBasis' in this.document.documentElement.style ? 'webkitFlexBasis' :
        'msFlexPreferredSize' in this.document.documentElement.style ? 'msFlexPreferredSize' : 'flexBasis';
  }

  private dragResizeActive() {
    return this.render.listen(this.document, 'mousemove', this.dragging.bind(this));
  }

  private addResizerToElements() {
    const divResize = this.render.createElement('div');
    const spanResize = this.render.createElement('span');

    this.render.appendChild(divResize, spanResize);
    this.render.addClass(divResize, 'rg-item');
    this.render.addClass(divResize, 'rg-' + this.rDirections);

    this.render.addClass(this.elementRef.nativeElement, 'resizable');

    const dragResize: Array<any> = [];

    const startResize = this.render.listen(divResize, 'mousedown', (e) => {
      this.dragStart(e);
      dragResize.push(this.dragResizeActive());
    });

    const endResize = this.render.listen(this.document, 'mouseup', (e) => {
      if (dragResize.length > 0) {
        dragResize.forEach(item => {
          item();
        });
      }
    });

    this.render.appendChild(this.elementRef.nativeElement, divResize);
  }

  private dragStart(e: MouseEvent) {
    this.axis = this.rDirections === DirectionTypeEnum.LEFT || this.rDirections === DirectionTypeEnum.RIGHT
      ? AxisTypeEnum.X
      : AxisTypeEnum.Y;
    this.startInfo = this.axis === AxisTypeEnum.X ? e.clientX : e.clientY;
    this.widthElement = parseInt(this.elementRef.nativeElement.offsetWidth, 10);
    this.heightElement = parseInt(this.elementRef.nativeElement.offsetHeight, 10);
    this.render.addClass(this.elementRef.nativeElement, 'no-transition');

    // Disable highlighting while dragging
    if (e.stopPropagation) {
      e.stopPropagation();
    }
    if (e.preventDefault) {
      e.preventDefault();
    }
    e.cancelBubble = true;
    e.returnValue = false;
  }

}
