import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyexampleComponent } from './myexample.component';

describe('MyexampleComponent', () => {
  let component: MyexampleComponent;
  let fixture: ComponentFixture<MyexampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyexampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyexampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
