import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AButtonComponent } from "../../../../ui/atoms/a-button/a-button.component";

@Component({
  selector: 'app-step-2-contact',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, AButtonComponent],
  templateUrl: './step-2-contact.component.html',
  styleUrl: './step-2-contact.component.scss'
})
export class Step2ContactComponent {
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

  // Order summary
  subtotal = 402.00;
  discount = 9.00;
  total = 393.00;
  couponCode = 'SR32899111';
}
