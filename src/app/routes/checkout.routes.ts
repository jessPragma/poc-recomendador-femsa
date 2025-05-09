import { Routes } from '@angular/router';

export const checkOutRoutes: Routes = [
	{
		path: 'checkout',
		loadComponent: async () =>
			import('../components/super-retail/checkout/checkout.component').then((m) => m.CheckoutComponent)
	},
	{
		path: '',
		loadComponent: async () =>
			import('../components/super-retail/home-olimpica/home-olimpica.component').then((m) => m.HomeOlimpicaComponent)
	},
];
