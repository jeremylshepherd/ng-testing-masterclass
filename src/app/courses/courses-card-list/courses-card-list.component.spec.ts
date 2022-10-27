import {async, waitForAsync, ComponentFixture, TestBed} from '@angular/core/testing';
import {CoursesCardListComponent} from './courses-card-list.component';
import {CoursesModule} from '../courses.module';
import {COURSES} from '../../../../server/db-data';
import {DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';
import {sortCoursesBySeqNo} from '../home/sort-course-by-seq';
import {Course} from '../model/course';
import {setupCourses} from '../common/setup-test-data';

describe('CoursesCardListComponent', () => {
  let component: CoursesCardListComponent;
  let fixture: ComponentFixture<CoursesCardListComponent>;
  let dbgEl;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CoursesModule],
      // declarations: []
    })
    .compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(CoursesCardListComponent);
      component = fixture.componentInstance;
      dbgEl = fixture.debugElement;
    });
  }));

  //JER_TODO Create test
  it("should create the component", () => {
    expect(component).toBeTruthy('component did not render');
  });


  it("should display the course list", () => {
    component.courses = setupCourses();
    fixture.detectChanges();
    const cards = dbgEl.queryAll(By.css('.course-card'));

    expect(cards).toBeTruthy('can not finds cards');
    expect(cards.length).toBe(12, 'unexpected number of cards');
  });


  it("should display the first course", () => {
    component.courses = setupCourses();
    fixture.detectChanges();
    const course = component.courses[0];
    const card = dbgEl.query(By.css('.course-card:first-child'));
    const title = dbgEl.query(By.css('mat-card-title'));
    const image = dbgEl.query(By.css('img'));

    expect(card).toBeTruthy('card was not rendered');
    expect(title.nativeElement.textContent).toBe(course.titles.description);
    expect(image.nativeElement.src).toBe(course.iconUrl);
  });
});


