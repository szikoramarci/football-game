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

  it('should find edge points from point perspective', () => {
    const testHexPoint1 = { x: 270, y: 129.90381056766577 }
    const testHexPoint2 = { x: 285, y: 155.88457268119893 }
    const testHexPoint3 = { x: 270, y: 181.8653347947321 }
    const testHexPoint4 = { x: 240, y: 181.8653347947321 }
    const testHexPoint5 = { x: 225, y: 155.88457268119893 }
    const testHexPoint6 = { x: 240, y: 129.90381056766577 }
    const testHexPoints = [ testHexPoint1, testHexPoint2, testHexPoint3, testHexPoint4, testHexPoint5, testHexPoint6 ]

    const testCases = [
      { startPoint: { x: 210, y: 233.8268590217984 }, expectPoints: [testHexPoint5, testHexPoint3] },
      { startPoint: { x: 300, y: 233.8268590217984 }, expectPoints: [testHexPoint4, testHexPoint2] },
      { startPoint: { x: 165, y: 103.92304845413263 }, expectPoints: [testHexPoint1, testHexPoint4] },
      { startPoint: { x: 255, y: 51.96152422706631 }, expectPoints: [testHexPoint2, testHexPoint5] },
      { startPoint: { x: 255, y: 363.7306695894642 }, expectPoints: [testHexPoint5, testHexPoint2] },
      { startPoint: { x: 390, y: 233.8268590217984 }, expectPoints: [testHexPoint4, testHexPoint1] },
      { startPoint: { x: 165, y: 155.88457268119893 }, expectPoints: [testHexPoint6, testHexPoint4] },     
      { startPoint: { x: 345, y: 259.80762113533154 }, expectPoints: [testHexPoint4, testHexPoint1] },
      { startPoint: { x: 390, y: 181.8653347947321 }, expectPoints: [testHexPoint4, testHexPoint1] },
      { startPoint: { x: 345, y: 155.88457268119893 }, expectPoints: [testHexPoint1, testHexPoint3] },
    ]

    testCases.forEach(testCase => {
      const testPoints = service.findEdgePointsFromPointPerspective(testCase.startPoint, testHexPoints);
      testCase.expectPoints.forEach(expectPoint => {
        expect(testPoints).toContain(expectPoint)
      })      
    })
  });
  
});
