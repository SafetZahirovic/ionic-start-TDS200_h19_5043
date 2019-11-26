import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRoomPage } from './new-room.page';

describe('NewPostPage', () => {
  let component: NewRoomPage;
  let fixture: ComponentFixture<NewRoomPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewRoomPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewRoomPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
