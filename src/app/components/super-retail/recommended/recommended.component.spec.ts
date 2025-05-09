import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommendedComponent } from './recommended.component';

describe('RecommendedComponent', () => {
  let component: RecommendedComponent;
  let fixture: ComponentFixture<RecommendedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecommendedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecommendedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should have 4 recommended items', () => {
    expect(component.recommendedItems.length).toBe(4);
  });

  it('should render title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.recommended-title')?.textContent).toContain('Recomendados para ti');
  });
});
