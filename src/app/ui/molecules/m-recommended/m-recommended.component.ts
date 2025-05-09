import { NgFor } from '@angular/common';
import { Component } from '@angular/core';

interface RecommendedItem {
  id: number;
  image: string;
  title: string;
}

@Component({
  selector: 'm-recommended',
  standalone: true,
  imports: [NgFor],
  templateUrl: './m-recommended.component.html',
  styleUrl: './m-recommended.component.scss'
})
export class MRecommendedComponent {
  recommendedItems: RecommendedItem[] = [
    {
      id: 1,
      image: 'images/snacks.jpg',
      title: 'Snacks y botanas'
    },
    {
      id: 2,
      image: 'images/promociones.jpg',
      title: 'Promociones'
    },
    {
      id: 3,
      image: 'images/recetas.jpg',
      title: 'Recetas'
    },
    {
      id: 4,
      image: 'images/bebidas.jpg',
      title: 'Bebidas'
    }
  ];
}
