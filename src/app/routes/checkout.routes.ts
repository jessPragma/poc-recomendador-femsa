import { Routes } from '@angular/router';

export const checkOutRoutes: Routes = [
	{
		path: 'checkout',
		loadComponent: async () =>
			import('../components/super-retail/checkout/checkout.component').then((m) => m.CheckoutComponent),
		children: [
			{
				path: '',
				pathMatch: 'full',
				redirectTo: 'step-1'
			},
			{
				path: 'step-1',
				loadComponent: async () =>
					import('../components/super-retail/checkout/step-1-verify/step-1-verify.component').then(
						(m) => m.Step1VerifyComponent
					)
			},
			{
				path: 'step-2',
				loadComponent: async () =>
					import('../components/super-retail/checkout/step-2-contact/step-2-contact.component').then(
						(m) => m.Step2ContactComponent
					)
			},
			{
				path: 'step-3',
				loadComponent: async () =>
					import('../components/super-retail/checkout/step-3-payment/step-3-payment.component').then(
						(m) => m.Step3PaymentComponent
					)
			},
			{
				path: 'step-4',
				loadComponent: async () =>
					import('../components/super-retail/checkout/step-4-confirmation/step-4-confirmation.component').then(
						(m) => m.Step4ConfirmationComponent
					)
			}
		]
	},
	{
		path: '',
		loadComponent: async () =>
			import('../components/super-retail/home-olimpica/home-olimpica.component').then((m) => m.HomeOlimpicaComponent)
	},
];
