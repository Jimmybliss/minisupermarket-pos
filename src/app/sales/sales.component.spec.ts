import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesComponent } from './sales.component';
import { provideHttpClient } from '@angular/common/http';

describe('SalesComponent', () => {
  let component: SalesComponent;
  let fixture: ComponentFixture<SalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideHttpClient()],
      imports: [SalesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(SalesComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
