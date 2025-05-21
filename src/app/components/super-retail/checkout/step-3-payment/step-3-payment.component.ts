import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AButtonComponent } from "../../../../ui/atoms/a-button/a-button.component";
import { ALogoComponent } from "../../../../ui/atoms/a-logo/a-logo.component";
import { CartService } from '@core/services/cart/cart.service';
import { CartItem } from '@core/models/cart-item.model';

@Component({
  selector: 'app-step-3-payment',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, AButtonComponent, ALogoComponent],
  templateUrl: './step-3-payment.component.html',
  styleUrl: './step-3-payment.component.scss'
})
export class Step3PaymentComponent {
  products: CartItem[] = [];
  subtotal = 0;
  discount = 0;
  total = 0;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    // Suscribirse a los cambios del carrito
    this.cartService.cartItems$.subscribe(items => {
      this.products = items;
      this.updateTotals();
    });
  }

  /**
   * Actualiza los totales del carrito
   */
  updateTotals(): void {
    this.subtotal = this.cartService.getSubtotal();
    this.discount = this.cartService.getTotalDiscount();
    this.total = this.cartService.getTotal();
  }
  // Selected payment method
  selectedPaymentMethod: string = 'digitalAccount';
  
  // Transfer code
  transferCode: string = 'SR32899111';

}
