import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ALogoComponent } from 'src/app/ui/atoms/a-logo/a-logo.component';

@Component({
  selector: 'app-step-4-confirmation',
  standalone: true,
  imports: [CommonModule, RouterModule, ALogoComponent],
  templateUrl: './step-4-confirmation.component.html',
  styleUrl: './step-4-confirmation.component.scss'
})
export class Step4ConfirmationComponent {
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
