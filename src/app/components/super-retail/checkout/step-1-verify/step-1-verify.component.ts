import { Component, OnInit } from '@angular/core';
import { AtomsModule } from '@ui/atoms/atoms.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AButtonComponent } from "../../../../ui/atoms/a-button/a-button.component";
import { CartService } from '@core/services/cart/cart.service';
import { CartItem } from '@core/models/cart-item.model';

@Component({
  selector: 'app-step-1-verify',
  standalone: true,
  imports: [AtomsModule, CommonModule, RouterModule, FormsModule, AButtonComponent],
  templateUrl: './step-1-verify.component.html',
  styleUrl: './step-1-verify.component.scss'
})
export class Step1VerifyComponent implements OnInit {
  products: CartItem[] = [];
  subtotal = 0;
  discount = 0;
  total = 0;
  couponCode = 'SR32899111';

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

  /**
   * Incrementa la cantidad de un producto
   */
  increaseQuantity(itemId: string): void {
    const item = this.products.find(i => i.id === itemId);
    if (item) {
      this.cartService.updateQuantity(itemId, item.quantity + 1);
    }
  }

  /**
   * Disminuye la cantidad de un producto
   */
  decreaseQuantity(itemId: string): void {
    const item = this.products.find(i => i.id === itemId);
    if (item && item.quantity > 1) {
      this.cartService.updateQuantity(itemId, item.quantity - 1);
    } else if (item) {
      this.removeItem(itemId);
    }
  }

  /**
   * Elimina un producto del carrito
   */
  removeItem(itemId: string): void {
    this.cartService.removeFromCart(itemId);
  }

  /**
   * Vacía todo el carrito
   */
  clearCart(): void {
    this.cartService.clearCart();
  }
}
