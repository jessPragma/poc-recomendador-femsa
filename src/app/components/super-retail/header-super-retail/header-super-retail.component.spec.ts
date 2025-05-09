import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderSuperRetailComponent } from './header-super-retail.component';

describe('HeaderSuperRetailComponent', () => {
  let component: HeaderSuperRetailComponent;
  let fixture: ComponentFixture<HeaderSuperRetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderSuperRetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderSuperRetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
