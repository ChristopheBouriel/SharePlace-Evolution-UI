import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicationListItemComponent } from './publication-list-item.component';

describe('PublicationListItemComponent', () => {
  let component: PublicationListItemComponent;
  let fixture: ComponentFixture<PublicationListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicationListItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicationListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
