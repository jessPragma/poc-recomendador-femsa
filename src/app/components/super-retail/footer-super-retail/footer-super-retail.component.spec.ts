import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterSuperRetailComponent } from './footer-super-retail.component';

describe('FooterSuperRetailComponent', () => {
  let component: FooterSuperRetailComponent;
  let fixture: ComponentFixture<FooterSuperRetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterSuperRetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FooterSuperRetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
