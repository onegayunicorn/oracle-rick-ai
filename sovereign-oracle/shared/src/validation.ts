import { z } from 'zod';

export const SensorPayloadSchema = z.object({
  ts: z.number(),
  lux: z.number().min(0),
  cct: z.number().min(1000).max(40000),
  pressure: z.number().positive(),
  pressureThreshold: z.number().positive(),
  deviceId: z.string().min(1),
  battery: z.number().min(0).max(100),
});

export const CartridgeManifestSchema = z.object({
  version: z.string(),
  pipeline: z.string(),
  pressureThreshold: z.number(),
  script: z.string(),
});

export const NexusStateSchema = z.object({
  tick: z.number().int().nonnegative(),
  patterns: z.record(z.string(), z.number()),
  sensor: SensorPayloadSchema.nullable(),
  cartridgeManifest: CartridgeManifestSchema.nullable(),
  lastUpdate: z.number(),
});
