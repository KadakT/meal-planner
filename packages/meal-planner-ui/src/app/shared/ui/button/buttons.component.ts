import { Component, EventEmitter, input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'text';
type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [MatButtonModule, MatProgressSpinnerModule],
  template: `
    <button 
        mat-button
        [attr.type]="btnType()" 
        [attr.aria-label]="btnLabel()" 
        (click)="onClick($event)" 
        [class]="classes"
        [disabled]="disabled()">
          @if(loading()) {
            <mat-spinner diameter="16"></mat-spinner>
          } @else {
            <ng-content />
          }
    </button>
  `,
})
export class ButtonsComponent {
  @Output() pressed = new EventEmitter<void>();

  btnType = input<string>('button');
  btnLabel = input<string>();
  btnClass = input<string>();
  variant: ButtonVariant = 'primary';
  size: ButtonSize = 'md';
  disabled = input<boolean>(false);
  loading = input<boolean>(false);

  get classes() {
    return [
      `btn-${this.variant}`,
      `btn-${this.size}`
    ];
  }

    onClick(event: Event) {
      if (this.disabled()) {
        event.preventDefault();
        event.stopPropagation();
      }
    }
}
