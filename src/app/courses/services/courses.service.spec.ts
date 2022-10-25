import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CoursesService } from "./courses.service";
import { COURSES, LESSONS, findLessonsForCourse } from "../../../../server/db-data";
import { Course } from "../model/course";
import { HttpErrorResponse } from "@angular/common/http";

describe('CourseService', () => {
    let coursesService: CoursesService,
        httpTestingController: HttpTestingController ;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [CoursesService]
        });
        coursesService = TestBed.inject(CoursesService);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    it('should return all courses', () => {
        const COURSE_NUM = 12
        coursesService.findAllCourses().subscribe((courses) => {
            expect(courses).toBeTruthy('No courses returned');
            expect(courses.length).toBe(COURSE_NUM, 'incorrect number of courses');

            const angularTestingCourse = courses.find(course => course.id == COURSE_NUM);
            expect(angularTestingCourse.titles.description).toBe('Angular Testing Course', 'incorrect title returned');
        });
        const req = httpTestingController.expectOne('/api/courses');
        expect(req.request.method).toEqual('GET');
        req.flush({payload: Object.values(COURSES)});
    });

    it('should find course by id', () => {
        const COURSE_NUM = 12;
        coursesService.findCourseById(COURSE_NUM).subscribe((course) => {
            expect(course).toBeTruthy('No course returned');
            expect(course.id).toBe(COURSE_NUM, 'incorrect id');
            expect(course.titles.description).toBe('Angular Testing Course', 'incorrect title returned');
        });
        const req = httpTestingController.expectOne(`/api/courses/${COURSE_NUM}`);
        expect(req.request.method).toEqual('GET');
        req.flush(COURSES[COURSE_NUM]);
    });

    it('should save course', () => {
        const COURSE_NUM = 12;
        const changes: Partial<Course> = {
            titles: {description: 'Testing Course'}
        };
        coursesService.saveCourse(COURSE_NUM, changes).subscribe((course) => {
            expect(course.id).toBe(COURSE_NUM);
        });
        const req = httpTestingController.expectOne(`/api/courses/${COURSE_NUM}`);
        expect(req.request.method).toEqual('PUT');
        expect(req.request.body.titles.description).toEqual(changes.titles.description);
        req.flush({
           ... COURSES[COURSE_NUM],
            ...changes
        });
    });

    it('should throw an error if save course fails', () => {
        const COURSE_NUM = 12;
        const changes: Partial<Course> = {
            titles: {description: 'Testing Course'}
        };
        coursesService.saveCourse(COURSE_NUM, changes).subscribe(() => fail('The save operation should have failed'),
            (error: HttpErrorResponse) => expect(error.status).toBe(500)
        );

        const req = httpTestingController.expectOne(`/api/courses/${COURSE_NUM}`);
        expect(req.request.method).toEqual('PUT');
        req.flush('Save course failed', { status: 500, statusText: 'Internal Server Error'});
    });

    it('should find a list of lessons', () => {
        const COURSE_NUM = 12
        coursesService.findLessons(COURSE_NUM).subscribe((lessons) => {
            expect(lessons).toBeTruthy('no data was returned');
            expect(lessons.length).toBe(3);
        });
        const req = httpTestingController.expectOne((req) => req.url === '/api/lessons');
        expect(req.request.method).toEqual('GET');
        expect(req.request.params.get('courseId')).toEqual(`${COURSE_NUM}`);
        expect(req.request.params.get('filter')).toEqual('');
        expect(req.request.params.get('sortOrder')).toEqual('asc');
        expect(req.request.params.get('pageNumber')).toEqual('0');
        expect(req.request.params.get('pageSize')).toEqual('3');

        req.flush({
            payload: findLessonsForCourse(COURSE_NUM).slice(0,3)
        });
    });

    afterEach(() => httpTestingController.verify());
});