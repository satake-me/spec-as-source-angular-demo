/**
 * Timezone Configurations: 9 key global regions
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
 * - Japan: Tokyo
 * - China: Shanghai
 * - India: New Delhi
 * - Germany: Berlin
 * - UTC-0: Prime Meridian
 * - Brazil: Brasilia
 * - United States: New York
 * - Canada: Toronto
 * - Mexico: Mexico City
 *
 * IANA timezone identifiers automatically handle DST transitions.
 * BCP 47 locale tags ensure locale-aware formatting.
 */
export const TIMEZONE_CONFIGS: ReadonlyArray<TimeZoneConfig> = [
  {
    id: 'japan',
    region: 'Japan',
    city: 'Tokyo',
    timeZoneId: 'Asia/Tokyo',
    locale: 'ja-JP',
  },
  {
    id: 'china',
    region: 'China',
    city: 'Shanghai',
    timeZoneId: 'Asia/Shanghai',
    locale: 'zh-CN',
  },
  {
    id: 'india',
    region: 'India',
    city: 'New Delhi',
    timeZoneId: 'Asia/Kolkata',
    locale: 'en-IN',
  },
  {
    id: 'germany',
    region: 'Germany',
    city: 'Berlin',
    timeZoneId: 'Europe/Berlin',
    locale: 'de-DE',
  },
  {
    id: 'utc',
    region: 'UTC-0',
    city: 'Prime Meridian',
    timeZoneId: 'Etc/UTC',
    locale: 'en-GB',
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
    id: 'canada',
    region: 'Canada',
    city: 'Toronto',
    timeZoneId: 'America/Toronto',
    locale: 'en-CA',
  },
  {
    id: 'mexico',
    region: 'Mexico',
    city: 'Mexico City',
    timeZoneId: 'America/Mexico_City',
    locale: 'es-MX',
  },
];
