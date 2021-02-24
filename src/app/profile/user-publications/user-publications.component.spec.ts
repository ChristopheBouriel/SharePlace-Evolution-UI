import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPublicationsComponent } from './user-publications.component';

describe('UserPublicationsComponent', () => {
  let component: UserPublicationsComponent;
  let fixture: ComponentFixture<UserPublicationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserPublicationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPublicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
