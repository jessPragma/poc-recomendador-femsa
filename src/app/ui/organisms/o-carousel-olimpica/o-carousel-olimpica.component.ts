import { NgStyle } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { ALogoComponent } from '../../atoms/a-logo/a-logo.component';

@Component({
  selector: 'o-carousel-olimpica',
  standalone: true,
  imports: [CarouselModule, NgStyle, ALogoComponent],
  templateUrl: './o-carousel-olimpica.component.html',
  styleUrl: './o-carousel-olimpica.component.scss'
})
export class OCarouselOlimpicaComponent implements OnInit {
  currentResolution: string = '1024px'; // Valor por defecto
  
  carouselItems = [
    {
      background: '',
      title: 'Banner 1',
      subtitle: 'Descripción del banner 1',
      buttonText: 'Más Información'
    },
    {
      background: '',
      title: 'Banner 2',
      subtitle: 'Descripción del banner 2',
      buttonText: 'Más Información'
    },
    {
      background: '',
      title: 'Banner 3',
      subtitle: 'Descripción del banner 3',
      buttonText: 'Más Información'
    }
  ];

  duplicatedCarouselItems: any[] = [];
  currentSlide = 1; // Comienza en el primer slide real
  transitionStyle = 'transform 0.5s ease';
  isTransitioning = false;

  constructor() { }
  
  ngOnInit() {
    this.checkScreenSize();
    this.updateBannerImages();
    setInterval(() => this.nextSlide(), 3000); // Cambio automático cada 3 segundos
  }
  
  @HostListener('window:resize')
  onResize() {
    this.checkScreenSize();
    this.updateBannerImages();
  }
  
  checkScreenSize() {
    const width = window.innerWidth;
    if (width <= 744) {
      this.currentResolution = '744px';
    } else if (width <= 1024) {
      this.currentResolution = '1024px';
    } else if (width <= 1440) {
      this.currentResolution = '1440px';
    } else {
      this.currentResolution = '1920px';
    }
  }
  
  updateBannerImages() {
    // Actualiza las URLs de las imágenes según la resolución actual
    this.carouselItems[0].background = `images/banner1-${this.currentResolution}.png`;
    this.carouselItems[1].background = `images/banner2-${this.currentResolution}.png`;
    this.carouselItems[2].background = `images/banner3-${this.currentResolution}.png`;
    
    // Actualiza el array duplicado
    this.duplicatedCarouselItems = [
      this.carouselItems[this.carouselItems.length - 1], // Último item como primero (duplicado)
      ...this.carouselItems,
      this.carouselItems[0] // Primer item como último (duplicado)
    ];
  }

  nextSlide() {
    if (this.isTransitioning) return;
    this.currentSlide++;

    if (this.currentSlide >= this.duplicatedCarouselItems.length - 1) {
      this.isTransitioning = true;
      this.transitionStyle = 'transform 0.5s ease';
      setTimeout(() => {
        this.transitionStyle = 'none';
        this.currentSlide = 1; // Rebobina al primer slide real
        setTimeout(() => {
          this.transitionStyle = 'transform 0.5s ease';
          this.isTransitioning = false;
        }, 50);
      }, 500);
    }
  }

  prevSlide() {
    if (this.isTransitioning) return;
    this.currentSlide--;

    if (this.currentSlide <= 0) {
      this.isTransitioning = true;
      this.transitionStyle = 'transform 0.5s ease';
      setTimeout(() => {
        this.transitionStyle = 'none';
        this.currentSlide = this.carouselItems.length; // Rebobina al último slide real
        setTimeout(() => {
          this.transitionStyle = 'transform 0.5s ease';
          this.isTransitioning = false;
        }, 50);
      }, 500);
    }
  }

  getTransformStyle() {
    return `translateX(-${this.currentSlide * 100}%)`;
  }

  goToSlide(index: number) {
    if (this.isTransitioning) return;
    this.currentSlide = index + 1;
  }
}
