import { Directive, ElementRef, HostListener, Renderer2, AfterViewInit, inject } from '@angular/core';

@Directive({
  selector: '[appHasValue]',
  standalone: true
})
export class HasValueDirective implements AfterViewInit {
    private el = inject(ElementRef);
    private renderer = inject(Renderer2);  

  ngAfterViewInit() {
    this.updateClass();
  }

  @HostListener('input')
  @HostListener('change')
  @HostListener('blur')
  onValueChange() {
    this.updateClass();
  }

  private updateClass() {
    const value = (this.el.nativeElement as HTMLInputElement).value;
    if (value && value.trim().length > 0) {
      this.renderer.addClass(this.el.nativeElement, 'has-value');
    } else {
      this.renderer.removeClass(this.el.nativeElement, 'has-value');
    }
  }
}
