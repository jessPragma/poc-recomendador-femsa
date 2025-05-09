import { Component, Input } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ACardLocationComponent } from '@ui/atoms/a-card-location/a-card-location.component';
import { ALogoComponent } from '@ui/atoms/a-logo/a-logo.component';
import { MBannerOlimpicaComponent } from '@ui/molecules/m-banner-olimpica/m-banner-olimpica.component';
import { OCarouselOlimpicaComponent } from '@ui/organisms/o-carousel-olimpica/o-carousel-olimpica.component';
import { TModalComponent } from '@ui/templates/t-modal/t-modal.component';
import { MNavbarOlimpicaComponent } from "../../../ui/molecules/m-navbar-olimpica/m-navbar-olimpica.component";
import { HeaderSuperRetailComponent } from "../header-super-retail/header-super-retail.component";

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [RouterOutlet,HeaderSuperRetailComponent, TModalComponent, MNavbarOlimpicaComponent, ACardLocationComponent, ALogoComponent, OCarouselOlimpicaComponent, MBannerOlimpicaComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {
  @Input() showModal = false;

  openModal(): void {
		this.showModal = true;
	}

  
	closeModal(): void {
		this.showModal = false;
	}
}
