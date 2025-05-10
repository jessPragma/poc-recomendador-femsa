import { Component } from '@angular/core';
import { AtomsModule } from '@ui/atoms/atoms.module';
import { OrganismsModule } from '@ui/organisms/organisms.module';
import { ASeparatorComponent } from "../../../ui/atoms/a-separator/a-separator.component";
import { CartModalComponent } from "../cart-modal/cart-modal.component";

@Component({
  selector: 'app-header-super-retail',
  standalone: true,
	imports: [OrganismsModule, AtomsModule, ASeparatorComponent, CartModalComponent],
  templateUrl: './header-super-retail.component.html',
  styleUrl: './header-super-retail.component.scss'
})
export class HeaderSuperRetailComponent {
  isSidebarOpen = false;
  isCartOpen = false;

  /**
   * Toggles the sidebar menu open/closed state
   */
  toggleSidebar(): void {
    // Close cart modal if open
    if (this.isCartOpen) {
      this.isCartOpen = false;
    }
    
    this.isSidebarOpen = !this.isSidebarOpen;
    
    // Prevent body scrolling when sidebar is open
    this.toggleBodyScrolling();
  }

  /**
   * Toggles the cart modal open/closed state
   */
  toggleCartModal(): void {
    // Close sidebar if open
    if (this.isSidebarOpen) {
      this.isSidebarOpen = false;
    }
    
    this.isCartOpen = !this.isCartOpen;
    
    // Prevent body scrolling when cart is open
    this.toggleBodyScrolling();
  }

  /**
   * Closes the sidebar menu
   */
  closeSidebar(): void {
    if (this.isSidebarOpen) {
      this.isSidebarOpen = false;
      this.toggleBodyScrolling();
    }
  }

  /**
   * Closes the cart modal
   */
  closeCart(): void {
    if (this.isCartOpen) {
      this.isCartOpen = false;
      this.toggleBodyScrolling();
    }
  }

  /**
   * Closes all modals (sidebar and cart)
   */
  closeAll(): void {
    this.isSidebarOpen = false;
    this.isCartOpen = false;
    document.body.style.overflow = '';
  }

  /**
   * Helper method to toggle body scrolling based on modal states
   */
  private toggleBodyScrolling(): void {
    if (this.isSidebarOpen || this.isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }
}
