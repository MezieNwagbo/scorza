import { z } from 'zod';

export const MATCH_STATUS = Object.freeze({
  SCHEDULED: 'scheduled',
  LIVE: 'live',
  FINISHED: 'finished',
});

const isoDateTimeSchema = z.iso.datetime({ offset: true });

export const listMatchesQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(100).optional(),
});

export const matchIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const createMatchSchema = z.object({
  sport: z.string().min(1),
  homeTeam: z.string().min(1),
  awayTeam: z.string().min(1),
  startTime: z.string().refine((value) => isoDateTimeSchema.safeParse(value).success, {
    message: 'Must be a valid ISO date string',
  }),
  endTime: z.string().refine((value) => isoDateTimeSchema.safeParse(value).success, {
    message: 'Must be a valid ISO date string',
  }),
  homeScore: z.coerce.number().int().nonnegative().optional(),
  awayScore: z.coerce.number().int().nonnegative().optional(),
}).superRefine((match, context) => {
  const startTime = Date.parse(match.startTime);
  const endTime = Date.parse(match.endTime);

  if (Number.isFinite(startTime) && Number.isFinite(endTime) && endTime <= startTime) {
    context.addIssue({
      code: 'custom',
      path: ['endTime'],
      message: 'End time must be after start time',
    });
  }
});

export const updateScoreSchema = z.object({
  homeScore: z.coerce.number().int().nonnegative(),
  awayScore: z.coerce.number().int().nonnegative(),
});