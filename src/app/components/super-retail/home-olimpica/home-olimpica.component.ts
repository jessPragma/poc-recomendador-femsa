import { Component, Input } from '@angular/core';
import { TModalComponent } from '@ui/templates/t-modal/t-modal.component';
import { ACardLocationComponent } from "../../../ui/atoms/a-card-location/a-card-location.component";
import { ALogoComponent } from "../../../ui/atoms/a-logo/a-logo.component";
import { MBannerOlimpicaComponent } from "../../../ui/molecules/m-banner-olimpica/m-banner-olimpica.component";
import { MNavbarOlimpicaComponent } from "../../../ui/molecules/m-navbar-olimpica/m-navbar-olimpica.component";
import { OCarouselOlimpicaComponent } from "../../../ui/organisms/o-carousel-olimpica/o-carousel-olimpica.component";
import { HeaderSuperRetailComponent } from "../header-super-retail/header-super-retail.component";
import { RecommendedComponent } from "../recommended/recommended.component";

@Component({
  selector: 'app-home-olimpica',
  standalone: true,
  imports: [HeaderSuperRetailComponent, TModalComponent, MNavbarOlimpicaComponent, ACardLocationComponent, ALogoComponent, OCarouselOlimpicaComponent, MBannerOlimpicaComponent, RecommendedComponent],
  templateUrl: './home-olimpica.component.html',
  styleUrl: './home-olimpica.component.scss'
})
export class HomeOlimpicaComponent {
  @Input() showModal = false;

  openModal(): void {
		this.showModal = true;
	}

  
	closeModal(): void {
		this.showModal = false;
	}
}
