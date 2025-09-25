import { DestroyRef, inject, Injectable } from '@angular/core';
import { Subject, debounceTime, fromEvent, startWith } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'

@Injectable({
  providedIn: 'root'
})
export class ResizeService {
  innerWidthSub = new Subject<number>();
  innerWidthObservable = this.innerWidthSub.asObservable().pipe(startWith(document.documentElement.clientWidth));
  destroyRef = inject(DestroyRef);

  constructor() { }

  setViewportHeight() {
    let vh = document.documentElement.clientHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    fromEvent(window, 'resize')
    // takeUntilDestroyed(this.destroyRef),
      .pipe( debounceTime(100)
      )
      .subscribe(() => {
        const innerWidth = document.documentElement.clientWidth;
        this.innerWidthSub.next(innerWidth);
        setTimeout(() => {
          vh = document.documentElement.clientHeight * 0.01;
          document.documentElement.style.setProperty('--vh', `${vh}px`);
        }, 100);
      });
  }

  getBreakpoint(variable: string): string {
    return getComputedStyle(document.documentElement).getPropertyValue(variable);
  }
}