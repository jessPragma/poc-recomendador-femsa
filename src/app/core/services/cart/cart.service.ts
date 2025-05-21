import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem } from '../../models/cart-item.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  // BehaviorSubject para mantener el estado actual del carrito y notificar a los suscriptores cuando cambie
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([
    {
      id: '1',
      name: 'Jugo de naranja 1 L',
      brand: 'JUMEX',
      price: 35.00,
      quantity: 3,
      image: 'images/product1.png',
      discount: 0
    },
    {
      id: '2',
      name: 'Tequila 700 ML',
      brand: 'Hornitos Reposado',
      price: 367.00,
      quantity: 1,
      image: 'images/product2.png',
      discount: 9.00
    }
  ]);

  // Observable público para que los componentes se puedan suscribir
  public cartItems$: Observable<CartItem[]> = this.cartItemsSubject.asObservable();

  constructor() {}

  /**
   * Obtiene los items actuales del carrito
   */
  getCartItems(): CartItem[] {
    return this.cartItemsSubject.getValue();
  }

  /**
   * Agrega un item al carrito
   * Si el producto ya existe, se incrementa la cantidad
   */
  addToCart(item: CartItem): void {
    const currentItems = this.getCartItems();
    const existingItemIndex = currentItems.findIndex(i => i.id === item.id);

    if (existingItemIndex !== -1) {
      // Si el producto ya está en el carrito, incrementar la cantidad
      const updatedItems = [...currentItems];
      updatedItems[existingItemIndex].quantity += item.quantity || 1;
      this.cartItemsSubject.next(updatedItems);
    } else {
      // Si es un producto nuevo, agregarlo al carrito
      this.cartItemsSubject.next([...currentItems, item]);
    }
  }

  /**
   * Elimina un item del carrito
   */
  removeFromCart(itemId: string): void {
    const currentItems = this.getCartItems();
    const updatedItems = currentItems.filter(item => item.id !== itemId);
    this.cartItemsSubject.next(updatedItems);
  }

  /**
   * Actualiza la cantidad de un item específico
   */
  updateQuantity(itemId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(itemId);
      return;
    }

    const currentItems = this.getCartItems();
    const updatedItems = currentItems.map(item => {
      if (item.id === itemId) {
        return { ...item, quantity };
      }
      return item;
    });

    this.cartItemsSubject.next(updatedItems);
  }

  /**
   * Calcula el subtotal del carrito (sin descuentos)
   */
  getSubtotal(): number {
    return this.getCartItems().reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }

  /**
   * Calcula el total de descuentos
   */
  getTotalDiscount(): number {
    return this.getCartItems().reduce((total, item) => {
      return total + ((item.discount || 0) * item.quantity);
    }, 0);
  }

  /**
   * Calcula el total a pagar (subtotal - descuentos)
   */
  getTotal(): number {
    return this.getSubtotal() - this.getTotalDiscount();
  }

  /**
   * Calcula el número total de unidades en el carrito
   */
  getTotalUnits(): number {
    return this.getCartItems().reduce((total, item) => {
      return total + item.quantity;
    }, 0);
  }
  
  /**
   * Devuelve el número total de unidades en el carrito
   */
  getCartCount(): number {
    return this.getTotalUnits();
  }

  /**
   * Limpia todo el carrito
   */
  clearCart(): void {
    this.cartItemsSubject.next([]);
  }
}