import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AButtonComponent } from "../../../../ui/atoms/a-button/a-button.component";
import { ALogoComponent } from "../../../../ui/atoms/a-logo/a-logo.component";
import { CartService } from '@core/services/cart/cart.service';
import { CartItem } from '@core/models/cart-item.model';

@Component({
  selector: 'app-step-2-contact',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, AButtonComponent, ALogoComponent],
  templateUrl: './step-2-contact.component.html',
  styleUrl: './step-2-contact.component.scss'
})
export class Step2ContactComponent {
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

  // User details
  userDetails = {
    firstName: 'Pedro de Jesus',
    lastName: 'Almendariz',
    curp: 'GOVM800705MCLML801',
    phone: '2788239900',
    email: 'pedrolman90@gmail.com',
  };

  // Delivery details
  deliveryDetails = {
    city: 'Ciudad de México',
    delegation: 'Tlalpan',
    store: 'Tienda Super Retail 24'
  };

}
