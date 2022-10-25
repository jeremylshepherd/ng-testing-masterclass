import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CoursesService } from "./courses.service";
import { COURSES } from "../../../../server/db-data";
import { Course } from "../model/course";

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
        coursesService.findAllCourses().subscribe((courses) => {
            expect(courses).toBeTruthy('No courses returned');
            expect(courses.length).toBe(12, 'incorrect number of courses');

            const angularTestingCourse = courses.find(course => course.id == 12);
            expect(angularTestingCourse.titles.description).toBe('Angular Testing Course', 'incorrect title returned');
        });
        const req = httpTestingController.expectOne('/api/courses');
        expect(req.request.method).toEqual('GET');
        req.flush({payload: Object.values(COURSES)});
    });

    it('should find course by id', () => {
        coursesService.findCourseById(12).subscribe((course) => {
            expect(course).toBeTruthy('No course returned');
            expect(course.id).toBe(12, 'incorrect id');
            expect(course.titles.description).toBe('Angular Testing Course', 'incorrect title returned');
        });
        const req = httpTestingController.expectOne('/api/courses/12');
        expect(req.request.method).toEqual('GET');
        req.flush(COURSES[12]);
    });

    it('should save course', () => {
        const changes: Partial<Course> = {
            titles: {description: 'Testing Course'}
        };
        coursesService.saveCourse(12, changes).subscribe((course) => {
            expect(course.id).toBe(12);

        });
        const req = httpTestingController.expectOne('/api/courses/12');
        expect(req.request.method).toEqual('PUT');
        expect(req.request.body.titles.description).toEqual(changes.titles.description);
        req.flush({
           ... COURSES[12],
            ...changes
        });
    });

    it('should 04', () => {
        pending();
    });

    it('should 05', () => {
        pending();
    });

    afterEach(() => httpTestingController.verify())

});