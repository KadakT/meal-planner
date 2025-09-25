import { Component, EventEmitter, input, Output } from '@angular/core';

@Component({
  selector: 'app-buttons',
  standalone: true,
  imports: [],
  templateUrl: './buttons.component.html',
  styleUrl: './buttons.component.scss'
})
export class ButtonsComponent {
  @Output() pressed = new EventEmitter<void>();

  btnType = input<string>('button');
  btnText = input<string>();
  btnLabel = input<string>();
  btnClass = input<string>();

  onClick(){
    this.pressed.emit();
  }
}
