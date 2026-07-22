import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Elementos } from './elementos';

describe('Elementos', () => {
    let component: Elementos;
    let fixture: ComponentFixture<Elementos>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [Elementos],
        }).compileComponents();

        fixture = TestBed.createComponent(Elementos);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
