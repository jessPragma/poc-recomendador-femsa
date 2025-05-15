import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'a-custom-button',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './a-custom-button.component.html',
	styleUrl: './a-custom-button.component.scss'
})
export class ACustomButtonComponent {
	@Input() text = '';
	@Input() active = false;
	@Output() buttonClick = new EventEmitter<void>();

	handleClick(): void {
		this.buttonClick.emit();
	}
}
