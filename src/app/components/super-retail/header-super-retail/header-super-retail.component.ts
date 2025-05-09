import { Component } from '@angular/core';
import { AtomsModule } from '@ui/atoms/atoms.module';
import { OrganismsModule } from '@ui/organisms/organisms.module';
import { ASeparatorComponent } from "../../../ui/atoms/a-separator/a-separator.component";

@Component({
  selector: 'app-header-super-retail',
  standalone: true,
	imports: [OrganismsModule, AtomsModule, ASeparatorComponent],
  templateUrl: './header-super-retail.component.html',
  styleUrl: './header-super-retail.component.scss'
})
export class HeaderSuperRetailComponent {
  isSidebarOpen = false;

  /**
   * Toggles the sidebar menu open/closed state
   */
  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
    
    // Prevent body scrolling when sidebar is open
    if (this.isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  /**
   * Closes the sidebar menu
   */
  closeSidebar(): void {
    if (this.isSidebarOpen) {
      this.isSidebarOpen = false;
      document.body.style.overflow = '';
    }
  }
}
