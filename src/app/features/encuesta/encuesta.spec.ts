import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Encuesta } from './encuesta';

describe('Encuesta', () => {
    let component: Encuesta;
    let fixture: ComponentFixture<Encuesta>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [Encuesta],
        }).compileComponents();

        fixture = TestBed.createComponent(Encuesta);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
