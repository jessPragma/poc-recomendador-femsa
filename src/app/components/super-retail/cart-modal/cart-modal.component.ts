import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AtomsModule } from '@ui/atoms/atoms.module';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '@core/services/cart/cart.service';
import { CartItem } from '@core/models/cart-item.model';

@Component({
  selector: 'app-cart-modal',
  standalone: true,
  imports: [AtomsModule, CommonModule],
  templateUrl: './cart-modal.component.html',
  styleUrl: './cart-modal.component.scss'
})
export class CartModalComponent implements OnInit {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  
  cartItems: CartItem[] = [];
  subtotal = 0;
  discount = 0;
  total = 0;
  totalUnits = 0;

  constructor(private router: Router, private cartService: CartService) {}

  /**
   * Inicializa el componente y se suscribe a los cambios del carrito
   */
  ngOnInit(): void {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.updateCartTotals();
    });
  }

  /**
   * Actualiza los totales del carrito
   */
  private updateCartTotals(): void {
    this.subtotal = this.cartService.getSubtotal();
    this.discount = this.cartService.getTotalDiscount();
    this.total = this.cartService.getTotal();
    this.totalUnits = this.cartService.getTotalUnits();
  }

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

  /**
   * Incrementa la cantidad de un producto
   */
  increaseQuantity(itemId: string): void {
    const item = this.cartItems.find(i => i.id === itemId);
    if (item) {
      this.cartService.updateQuantity(itemId, item.quantity + 1);
    }
  }

  /**
   * Disminuye la cantidad de un producto
   */
  decreaseQuantity(itemId: string): void {
    const item = this.cartItems.find(i => i.id === itemId);
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
}
