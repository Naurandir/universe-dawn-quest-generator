import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicIdwithUrlCopyComponent } from './public-id-with-url-copy.component';

describe('PublicIdwithUrlCopyComponent', () => {
  let component: PublicIdwithUrlCopyComponent;
  let fixture: ComponentFixture<PublicIdwithUrlCopyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicIdwithUrlCopyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicIdwithUrlCopyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
