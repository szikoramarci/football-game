import { TestBed } from '@angular/core/testing';
import { CoordinateService } from './coordinate.service';
import { distance } from 'honeycomb-grid';

describe('CoordinateService', () => {
    let service: CoordinateService;

    beforeEach(() => {
        service = new CoordinateService();
    });


  it('should init the service', () => {
    expect(service).toBeTruthy();
  });

  it('should return the proper distance between points', () => {
    const testCases = [
        { point1: { x: 1, y: 1 }, point2: { x: 1, y: 1 }, distance: 0 },
        { point1: { x: 1, y: 1 }, point2: { x: 2, y: 1 }, distance: 1 },
        { point1: { x: 1, y: 1 }, point2: { x: 100, y: 1 }, distance: 99 },
        { point1: { x: 1, y: 1 }, point2: { x: 1, y: 100 }, distance: 99 },
        { point1: { x: 1, y: 1 }, point2: { x: 100, y: 100 }, distance: 140.00714 },
        { point1: { x: 1, y: 1 }, point2: { x: 1000, y: 1000 }, distance: 1412.7993 },
        { point1: { x: 324, y: 432 }, point2: { x: 5234, y: -234 }, distance: 4954.9628 },
        { point1: { x: -123, y: -123 }, point2: { x: 1212, y: 444 }, distance: 1450.4186 },
    ]

    testCases.forEach(testCase => {
        expect(service.calculatePointDistance(testCase.point1, testCase.point2)).toBeCloseTo(testCase.distance,4)
    })
  });
  
});
