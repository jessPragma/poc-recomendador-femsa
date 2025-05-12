import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AButtonComponent } from "../../../../ui/atoms/a-button/a-button.component";

@Component({
  selector: 'app-step-3-payment',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, AButtonComponent],
  templateUrl: './step-3-payment.component.html',
  styleUrl: './step-3-payment.component.scss'
})
export class Step3PaymentComponent {
  // Selected payment method
  selectedPaymentMethod: string = 'digitalAccount';
  
  // Transfer code
  transferCode: string = 'SR32899111';
  
  // Order summary
  subtotal = 402.00;
  discount = 9.00;
  total = 393.00;
  couponCode = 'SR32899111';
}
