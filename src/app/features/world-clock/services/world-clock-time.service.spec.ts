/**
 * World Clock Time Service Tests (T010-T013)
 */
import { TestBed } from '@angular/core/testing';
import { WorldClockTimeService } from './world-clock-time.service';
import { WorldClockEntry } from '../models/world-clock.models';
import { firstValueFrom } from 'rxjs';

describe('WorldClockTimeService', () => {
  let service: WorldClockTimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WorldClockTimeService],
    });
    service = TestBed.inject(WorldClockTimeService);
  });

  it('should return exactly 9 clock entries with UTC first (T010)', async () => {
    const entries = await firstValueFrom(service.getCurrentTimes());
    expect(entries.length).toBe(9);
    expect(entries[0].id).toBe('utc');

    const ids = entries.map((entry) => entry.id);
    expect(ids).toContain('japan');
    expect(ids).toContain('china');
    expect(ids).toContain('usa');
    expect(ids).toContain('brazil');
    expect(ids).toContain('india');
    expect(ids).toContain('germany');
    expect(ids).toContain('canada');
    expect(ids).toContain('mexico');
    expect(ids).toContain('utc');

    const nonNegativeOffsets = entries.filter((entry) => entry.utcOffset > 0).map((entry) => entry.utcOffset);
    const zeroOffsets = entries.filter((entry) => entry.utcOffset === 0);
    const negativeOffsets = entries.filter((entry) => entry.utcOffset < 0).map((entry) => entry.utcOffset);

    expect(nonNegativeOffsets.length).toBe(4);
    expect(zeroOffsets.length).toBe(1);
    expect(negativeOffsets.length).toBe(4);
    expect(zeroOffsets[0].id).toBe('utc');

    expect(nonNegativeOffsets).toEqual([...nonNegativeOffsets].sort((a, b) => b - a));
    expect(negativeOffsets).toEqual([...negativeOffsets].sort((a, b) => b - a));
  });

  it('should have valid entry structure with all required fields (T010)', async () => {
    const entries = await firstValueFrom(service.getCurrentTimes());
    entries.forEach((entry: WorldClockEntry) => {
      expect(entry.id).toBeTruthy();
      expect(typeof entry.id).toBe('string');
      expect(entry.region).toBeTruthy();
      expect(typeof entry.region).toBe('string');
      expect(entry.city).toBeTruthy();
      expect(entry.timeZoneId).toBeTruthy();
      expect(entry.locale).toBeTruthy();
      expect(entry.currentTime).toBeInstanceOf(Date);
      expect(typeof entry.utcOffset).toBe('number');
      // Offsets are typically between -14h and +14h
      expect(entry.utcOffset).toBeGreaterThanOrEqual(-840);
      expect(entry.utcOffset).toBeLessThanOrEqual(840);
    });
  });

  it('should emit times at initialization (T011 - immediate emission)', async () => {
    const entries = await firstValueFrom(service.getCurrentTimes());
    expect(entries).toBeDefined();
    expect(entries.length).toBeGreaterThan(0);
  });

  it('should calculate valid UTC offsets for each timezone (T012)', async () => {
    const entries = await firstValueFrom(service.getCurrentTimes());
    const brazil = entries.find((e) => e.id === 'brazil');
    const usa = entries.find((e) => e.id === 'usa');
    const china = entries.find((e) => e.id === 'china');
    const japan = entries.find((e) => e.id === 'japan');
    const utc = entries.find((e) => e.id === 'utc');

    expect(brazil).toBeDefined();
    expect(usa).toBeDefined();
    expect(china).toBeDefined();
    expect(japan).toBeDefined();
    expect(utc).toBeDefined();

    // Brazil (America/Sao_Paulo): UTC-3 or UTC-2
    expect(brazil!.utcOffset).toBeGreaterThanOrEqual(-241);
    expect(brazil!.utcOffset).toBeLessThanOrEqual(-119);

    // US East Coast (America/New_York): UTC-5 or UTC-4
    expect(usa!.utcOffset).toBeGreaterThanOrEqual(-301);
    expect(usa!.utcOffset).toBeLessThanOrEqual(-239);

    // China (Asia/Shanghai): UTC+8
    expect(china!.utcOffset).toBeCloseTo(480, 0);

    // Japan (Asia/Tokyo): UTC+9
    expect(japan!.utcOffset).toBeCloseTo(540, 0);

    // UTC reference line
    expect(utc!.utcOffset).toBe(0);
  });
});
