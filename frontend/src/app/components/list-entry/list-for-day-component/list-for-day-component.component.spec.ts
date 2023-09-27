import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListForDayComponentComponent } from './list-for-day-component.component';

describe('ListForDayComponentComponent', () => {
  let component: ListForDayComponentComponent;
  let fixture: ComponentFixture<ListForDayComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListForDayComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListForDayComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
