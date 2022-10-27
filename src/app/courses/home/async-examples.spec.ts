import { fakeAsync, flush, flushMicrotasks, tick } from "@angular/core/testing";
import { of } from "rxjs";
import { delay } from "rxjs/operators";

describe('Async Testing Examples', () => {

    it('Asynchronous test example with jasmine done', (done: DoneFn) => {
        let test = false;

        setTimeout(() => {
            console.log('running assertions');
            test = true;
            expect(test).toBeTruthy();
            done();
        }, 1000);
    });

    it('Asynchronous test example with jasmine fakeAsync', fakeAsync(() => {
        let test = false;
        setTimeout(() => {});
        setTimeout(() => {
            console.log('running assertions');
            test = true;
            expect(test).toBeTruthy();
        }, 1000);
        flush();
        tick(1000);
    }));

    it('Asynchronous test example with jasmine fakeAsync/flushMicroTasks', fakeAsync(() => {
        let test = false;
        console.log('creating promise');
        Promise.resolve().then(() => {
            console.log('Promise evaluated successfully');
            test = true;
        });
        flushMicrotasks();
        console.log('running assertions');
        // tick(1000);
        expect(test).toBeTruthy();
    }));

    it('Mixed Asynchronous test example with jasmine fakeAsync', fakeAsync(() => {
        let counter = 0;

        Promise.resolve().then(() => {
            counter+=10;
            setTimeout(() => {
                counter+=1;
            }, 1000);
        });
        expect(counter).toBe(0);
        flushMicrotasks();
        expect(counter).toBe(10);
        flush();
        expect(counter).toBe(11);
        // tick(1000);
    }));

    it('Asynchronous test example - Observables', fakeAsync(() => {
        let test = false;
        console.log('creating observable');

        const test$ = of(test).pipe(delay(1000));

        test$.subscribe(() => {
            test = true;
        });

        tick(1000);
        expect(test).toBeTruthy();
    }));
});