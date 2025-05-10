import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AtomsModule } from '@ui/atoms/atoms.module';

@Component({
  selector: 'app-cart-modal',
  standalone: true,
  imports: [AtomsModule],
  templateUrl: './cart-modal.component.html',
  styleUrl: './cart-modal.component.scss'
})
export class CartModalComponent {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();

  /**
   * Emits the close event to the parent component
   */
  closeModal(): void {
    this.close.emit();
  }
}
