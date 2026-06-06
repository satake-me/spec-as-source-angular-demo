/**
 * World Clock Time Service Tests (T010-T013)
 */
import { TestBed } from '@angular/core/testing';
import { WorldClockTimeService } from './world-clock-time.service';
import { take } from 'rxjs/operators';
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

  it('should return exactly 10 clock entries with UTC-0 first (T010)', async () => {
    const entries = await firstValueFrom(service.getCurrentTimes());
    expect(entries.length).toBe(10);
    expect(entries[0].id).toBe('utc');

    const ids = entries.map((entry) => entry.id);
    expect(ids).toContain('utc');
    expect(ids).toContain('usa');
    expect(ids).toContain('india');
    expect(ids).toContain('japan');
    expect(ids).toContain('germany');
    expect(ids).toContain('australia');
    expect(ids).toContain('uae');

    const nonUtcEntries = entries.slice(1);
    const nonNegativeOffsets = nonUtcEntries.filter((entry) => entry.utcOffset >= 0).map((entry) => entry.utcOffset);
    const negativeOffsets = nonUtcEntries.filter((entry) => entry.utcOffset < 0).map((entry) => entry.utcOffset);

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
    const uk = entries.find((e) => e.id === 'uk');
    const china = entries.find((e) => e.id === 'china');
    const utc = entries.find((e) => e.id === 'utc');

    expect(brazil).toBeDefined();
    expect(uk).toBeDefined();
    expect(china).toBeDefined();
    expect(utc).toBeDefined();

    expect(utc!.utcOffset).toBe(0);

    // Brazil (America/Sao_Paulo): UTC-3 or UTC-2
    expect(brazil!.utcOffset).toBeGreaterThanOrEqual(-241);
    expect(brazil!.utcOffset).toBeLessThanOrEqual(-119);

    // UK (Europe/London): UTC+0 or UTC+1
    expect(uk!.utcOffset).toBeGreaterThanOrEqual(-1);
    expect(uk!.utcOffset).toBeLessThanOrEqual(61);

    // China (Asia/Shanghai): UTC+8
    expect(china!.utcOffset).toBeCloseTo(480, 0);
  });
});
