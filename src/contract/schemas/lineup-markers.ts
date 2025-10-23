import { z } from 'zod';

import { IsoDateSchema } from './common';

export const LineupMarkerCreateBodySchema = z.object({
  name: z.string().min(1),
  date: IsoDateSchema,
});

export const LineupMarkerUpdateBodySchema = z
  .object({
    name: z.string().min(1).optional(),
    date: IsoDateSchema.optional(),
  })
  .refine((value) => value.name !== undefined || value.date !== undefined, {
    message: 'Either name or date must be provided.',
  });

export type LineupMarkerCreateBody = z.infer<typeof LineupMarkerCreateBodySchema>;
export type LineupMarkerUpdateBody = z.infer<typeof LineupMarkerUpdateBodySchema>;
