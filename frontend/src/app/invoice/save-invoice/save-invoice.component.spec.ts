import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveInvoiceComponent } from './save-invoice.component';

describe('SaveInvoiceComponent', () => {
  let component: SaveInvoiceComponent;
  let fixture: ComponentFixture<SaveInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveInvoiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
