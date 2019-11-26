import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailViewPage } from './detail-view.page';

describe('DetailViewPage', () => {
  let component: DetailViewPage;
  let fixture: ComponentFixture<DetailViewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailViewPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
