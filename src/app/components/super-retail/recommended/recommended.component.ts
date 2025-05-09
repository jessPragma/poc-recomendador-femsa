import { NgFor } from '@angular/common';
import { Component } from '@angular/core';

interface RecommendedItem {
  id: number;
  image: string;
  title: string;
}

@Component({
  selector: 'app-recommended',
  standalone: true,
  imports: [NgFor],
  templateUrl: './recommended.component.html',
  styleUrl: './recommended.component.scss'
})
export class RecommendedComponent {
  recommendedItems: RecommendedItem[] = [
    {
      id: 1,
      image: 'images/recommended1.png',
      title: 'Snacks y botanas'
    },
    {
      id: 2,
      image: 'images/recommended2.png',
      title: 'Promociones'
    },
    {
      id: 3,
      image: 'images/recommended3.png',
      title: 'Recetas'
    },
    {
      id: 4,
      image: 'images/recommended4.png',
      title: 'Bebidas'
    }
  ];
}
