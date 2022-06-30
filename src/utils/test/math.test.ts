import { floatRound, floatToPercent } from '../Math';

describe('Math', () => {
  test('should rounding float num', () => {
    expect(floatRound(0.1667)).toEqual(0.17);
    expect(floatRound(0.1667, 3)).toEqual(0.167);
    expect(floatRound(0.1667, 4)).toEqual(0.1667);
    expect(floatRound(0.1667, 1)).toEqual(0.2);
    expect(floatRound(0.1667, 0)).toEqual(0);
    expect(floatRound(20)).toEqual(20);
    expect(floatRound(24)).toEqual(24);
    expect(floatRound(25)).toEqual(25);
  });

  test('should turn percent to float', () => {
    expect(floatToPercent(0.1667)).toEqual(16.67);
    expect(floatToPercent(0.1667, 1)).toEqual(16.7);
    expect(floatToPercent(0.1667, 0)).toEqual(17);
    expect(floatToPercent(0.1667, 10)).toEqual(16.67);
  });
});
