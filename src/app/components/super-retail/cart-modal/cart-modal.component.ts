import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AtomsModule } from '@ui/atoms/atoms.module';
import { Router } from '@angular/router';

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

  constructor(private router: Router) {}

  /**
   * Emits the close event to the parent component
   */
  closeModal(): void {
    this.close.emit();
  }

  /**
   * Navigate to checkout page
   */
  goToCheckout(): void {
    this.close.emit();
    this.router.navigate(['/super-retail/checkout']);
  }
}
