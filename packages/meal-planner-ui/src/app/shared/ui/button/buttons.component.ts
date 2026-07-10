import { Component, EventEmitter, input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { ButtonSize, ButtonVariant } from 'app/shared/constants/ui/button.constants';

export type ButtonVariantType =
  typeof ButtonVariant[keyof typeof ButtonVariant];

export type ButtonSizeType =
  typeof ButtonSize[keyof typeof ButtonSize];

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [MatButtonModule, MatProgressSpinnerModule],
  template: `
    <button 
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
  btnSize = input<ButtonSizeType>(ButtonSize.Medium);
  btnVariant = input<ButtonVariantType>(ButtonVariant.Primary);
  disabled = input<boolean>(false);
  loading = input<boolean>(false);

  //protected readonly ButtonVariant = ButtonVariant;

  get classes() {
    return [
      `btn`,
      `btn-${this.btnVariant()}`,
      `btn-${this.btnSize()}`,
      this.btnClass()
    ].filter(Boolean).join(' ') || '';
  }

    onClick(event: Event) {
      if (this.disabled()) {
        event.preventDefault();
        event.stopPropagation();
      }else{
        this.pressed.emit();
      }
    }
}
