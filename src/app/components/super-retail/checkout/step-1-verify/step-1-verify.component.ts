import { Component } from '@angular/core';
import { AtomsModule } from '@ui/atoms/atoms.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AButtonComponent } from "../../../../ui/atoms/a-button/a-button.component";

@Component({
  selector: 'app-step-1-verify',
  standalone: true,
  imports: [AtomsModule,CommonModule, RouterModule, FormsModule, AButtonComponent],
  templateUrl: './step-1-verify.component.html',
  styleUrl: './step-1-verify.component.scss'
})
export class Step1VerifyComponent {
  products = [
    {
      name: 'Jugo de naranja JUMEX',
      brand: 'JUMEX',
      image: '/images/product1.png',
      quantity: 3,
      price: 35.00,
      size: '1 L'
    },
    {
      name: 'Tequila Hornitos Reposado',
      brand: 'Hornitos Reposado',
      image: '/images/product2.png',
      quantity: 1,
      price: 367.00,
      size: '700 ML'
    }
  ];

  subtotal = 402.00;
  discount = 9.00;
  total = 393.00;
  couponCode = 'SR32899111';
}
