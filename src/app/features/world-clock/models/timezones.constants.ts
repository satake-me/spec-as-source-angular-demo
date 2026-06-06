/**
 * Timezone Configurations: 10 key global regions
 *
 * Provides readonly configuration for supported regions.
 * Used to initialize WorldClockEntry instances.
 *
 * Reference: data-model.md, TimeZoneConfig interface
 */

import { TimeZoneConfig } from './world-clock.models';

/**
 * TIMEZONE_CONFIGS: Array of supported timezone configurations
 *
 * - UTC-0: Prime Meridian
 * - Germany: Berlin
 * - United Arab Emirates: Dubai
 * - India: New Delhi
 * - China: Shanghai
 * - Japan: Tokyo
 * - Australia: Sydney
 * - Brazil: Brasilia
 * - United States: New York
 *
 * IANA timezone identifiers automatically handle DST transitions.
 * BCP 47 locale tags ensure locale-aware formatting.
 */
export const TIMEZONE_CONFIGS: ReadonlyArray<TimeZoneConfig> = [
  {
    id: 'utc',
    region: 'UTC-0',
    city: 'Prime Meridian',
    timeZoneId: 'Etc/UTC',
    locale: 'en-GB',
  },
  {
    id: 'germany',
    region: 'Germany',
    city: 'Berlin',
    timeZoneId: 'Europe/Berlin',
    locale: 'de-DE',
  },
  {
    id: 'uae',
    region: 'United Arab Emirates',
    city: 'Dubai',
    timeZoneId: 'Asia/Dubai',
    locale: 'en-AE',
  },
  {
    id: 'india',
    region: 'India',
    city: 'New Delhi',
    timeZoneId: 'Asia/Kolkata',
    locale: 'en-IN',
  },
  {
    id: 'china',
    region: 'China',
    city: 'Shanghai',
    timeZoneId: 'Asia/Shanghai',
    locale: 'zh-CN',
  },
  {
    id: 'japan',
    region: 'Japan',
    city: 'Tokyo',
    timeZoneId: 'Asia/Tokyo',
    locale: 'ja-JP',
  },
  {
    id: 'australia',
    region: 'Australia',
    city: 'Sydney',
    timeZoneId: 'Australia/Sydney',
    locale: 'en-AU',
  },
  {
    id: 'brazil',
    region: 'Brazil',
    city: 'Brasília',
    timeZoneId: 'America/Sao_Paulo',
    locale: 'pt-BR',
  },
  {
    id: 'usa',
    region: 'United States',
    city: 'New York',
    timeZoneId: 'America/New_York',
    locale: 'en-US',
  },
  {
    id: 'uk',
    region: 'United Kingdom',
    city: 'London',
    timeZoneId: 'Europe/London',
    locale: 'en-GB',
  },
];
