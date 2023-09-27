import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateListEntryComponentComponent } from './create-list-entry-component.component';

describe('CreateListEntryComponentComponent', () => {
  let component: CreateListEntryComponentComponent;
  let fixture: ComponentFixture<CreateListEntryComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateListEntryComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateListEntryComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
