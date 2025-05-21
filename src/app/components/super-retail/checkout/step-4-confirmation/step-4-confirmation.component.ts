import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ALogoComponent } from 'src/app/ui/atoms/a-logo/a-logo.component';
import { CartService } from '@core/services/cart/cart.service';
import { CartItem } from '@core/models/cart-item.model';

@Component({
  selector: 'app-step-4-confirmation',
  standalone: true,
  imports: [CommonModule, RouterModule, ALogoComponent],
  templateUrl: './step-4-confirmation.component.html',
  styleUrl: './step-4-confirmation.component.scss'
})
export class Step4ConfirmationComponent {
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
  // Order information
  orderDetails = {
    products: [
      { name: 'Jugo Jumex', quantity: 3, price: 35.00 },
      { name: 'Hornitos Reposado', quantity: 1, price: 367.00 }
    ],
    total: 393.00,
    payment: {
      method: 'Cuenta digital Super Retail'
    },
    delivery: {
      city: 'Ciudad de México',
      delegation: 'Tlalpan',
      store: 'Tienda Super Retail 2455'
    }
  };
}
