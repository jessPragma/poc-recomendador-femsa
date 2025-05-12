import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AButtonComponent } from "../../../ui/atoms/a-button/a-button.component";

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [RouterModule, AButtonComponent],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent {

}
