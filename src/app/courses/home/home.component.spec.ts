import {async, ComponentFixture, fakeAsync, flush, flushMicrotasks, TestBed, tick, waitForAsync} from '@angular/core/testing';
import {CoursesModule} from '../courses.module';
import {DebugElement} from '@angular/core';

import {HomeComponent} from './home.component';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {CoursesService} from '../services/courses.service';
import {HttpClient} from '@angular/common/http';
import {COURSES} from '../../../../server/db-data';
import {setupCourses} from '../common/setup-test-data';
import {By} from '@angular/platform-browser';
import {of} from 'rxjs';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {click} from '../common/test-utils';




describe('HomeComponent', () => {

  let fixture: ComponentFixture<HomeComponent>;
  let component:HomeComponent;
  let dbgEl: DebugElement;
  let coursesService: any;

  const allCourses = setupCourses();
  const beginnerCourses = setupCourses().filter(course => course.category == 'BEGINNER');
  const advancedCourses = setupCourses().filter(course => course.category == 'ADVANCED');

  beforeEach(
    waitForAsync(() => {
      const coursesServiceSpy = jasmine.createSpyObj('CoursesService', ['findAllCourses']);
      TestBed.configureTestingModule({
        imports: [CoursesModule, NoopAnimationsModule],
        providers: [{provide: CoursesService, useValue: coursesServiceSpy}]
      })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        dbgEl = fixture.debugElement;
        coursesService = TestBed.get(CoursesService);
      });
    })
  );

  it("should create the component", () => {
    expect(component).toBeTruthy('component did not render');
  });


  it("should display only beginner courses", () => {
    coursesService.findAllCourses.and.returnValue(of(beginnerCourses));
    fixture.detectChanges();
    const tabs = dbgEl.queryAll(By.css('.mat-tab-label'));
    expect(tabs.length).toBe(1, 'Unexpected number of Tabs found');
  });


  it("should display only advanced courses", () => {
    coursesService.findAllCourses.and.returnValue(of(advancedCourses));
    fixture.detectChanges();
    const tabs = dbgEl.queryAll(By.css('.mat-tab-label'));
    expect(tabs.length).toBe(1, 'Unexpected number of Tabs found');  });


  it("should display both tabs", () => {
    coursesService.findAllCourses.and.returnValue(of(allCourses));
    fixture.detectChanges();
    const tabs = dbgEl.queryAll(By.css('.mat-tab-label'));
    expect(tabs.length).toBe(2, 'Unexpected number of Tabs found');
  });


  it("should display advanced courses when tab clicked - setTimeout", (done: DoneFn) => {
    coursesService.findAllCourses.and.returnValue(of(allCourses));
    fixture.detectChanges();

    const tabs = dbgEl.queryAll(By.css('.mat-tab-label'));
    click(tabs[1]);
    fixture.detectChanges();

    setTimeout(() => {
      const titles = dbgEl.queryAll(By.css('.mat-tab-body-active .mat-card-title'));
      expect(titles.length).toBeGreaterThan(0, 'could not find titles');
      expect(titles[0].nativeElement.textContent).toContain("Angular Security Course", 'unexpected title mismatch');
      done();
    }, 1000);
  });

  it("should display advanced courses when tab clicked - fakeAsync", fakeAsync(() => {
    coursesService.findAllCourses.and.returnValue(of(allCourses));
    fixture.detectChanges();
    const tabs = dbgEl.queryAll(By.css('.mat-tab-label'));
    click(tabs[1]);
    fixture.detectChanges();

    flush();
    // tick(1000);

    const titles = dbgEl.queryAll(By.css('.mat-tab-body-active .mat-card-title'));
    expect(titles.length).toBeGreaterThan(0, 'could not find titles');
    expect(titles[0].nativeElement.textContent).toContain("Angular Security Course", 'unexpected title mismatch');
  }));

  it("should display advanced courses when tab clicked - waitForAsync", waitForAsync(() => {
    coursesService.findAllCourses.and.returnValue(of(allCourses));
    fixture.detectChanges();
    const tabs = dbgEl.queryAll(By.css('.mat-tab-label'));
    click(tabs[1]);
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      const titles = dbgEl.queryAll(By.css('.mat-tab-body-active .mat-card-title'));
      expect(titles.length).toBeGreaterThan(0, 'could not find titles');
      expect(titles[0].nativeElement.textContent).toContain("Angular Security Course", 'unexpected title mismatch');
    });
  }));
});

