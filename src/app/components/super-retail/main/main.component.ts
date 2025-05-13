import { Component, Input, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { NgIf } from '@angular/common';
import { ACardLocationComponent } from '@ui/atoms/a-card-location/a-card-location.component';
import { ALogoComponent } from '@ui/atoms/a-logo/a-logo.component';
import { MBannerOlimpicaComponent } from '@ui/molecules/m-banner-olimpica/m-banner-olimpica.component';
import { OCarouselOlimpicaComponent } from '@ui/organisms/o-carousel-olimpica/o-carousel-olimpica.component';
import { TModalComponent } from '@ui/templates/t-modal/t-modal.component';
import { MNavbarOlimpicaComponent } from "../../../ui/molecules/m-navbar-olimpica/m-navbar-olimpica.component";
import { HeaderSuperRetailComponent } from "../header-super-retail/header-super-retail.component";
import { FooterSuperRetailComponent } from "../footer-super-retail/footer-super-retail.component";

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [RouterOutlet, HeaderSuperRetailComponent, FooterSuperRetailComponent, TModalComponent, MNavbarOlimpicaComponent, ACardLocationComponent, ALogoComponent, OCarouselOlimpicaComponent, MBannerOlimpicaComponent, NgIf],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit {
  @Input() showModal = false;
  isCheckoutRoute: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Check initial route
    this.checkIfCheckoutRoute(this.router.url);
    
    // Subscribe to route changes
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.checkIfCheckoutRoute(event.url);
      }
    });
  }

  // Check if current URL is a checkout route
  private checkIfCheckoutRoute(url: string): void {
    this.isCheckoutRoute = url.includes('/checkout');
  }

  openModal(): void {
		this.showModal = true;
	}
  
	closeModal(): void {
		this.showModal = false;
	}
}
