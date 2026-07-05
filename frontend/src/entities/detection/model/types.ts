import * as z from 'zod';

export const EyeSchema = z.object({
  cx: z.number(),
  cy: z.number(),
  radius: z.number(),
});

export const FaceSchema = z.object({
  x: z.number(),
  y: z.number(),
  w: z.number(),
  h: z.number(),
  eyes: z.array(EyeSchema),
})

export const DetectionResponseSchema = z.object({
  faces: z.array(FaceSchema),
});

export type Eye = z.infer<typeof EyeSchema>;
export type Face = z.infer<typeof FaceSchema>;
export type DetectionResponse = z.infer<typeof DetectionResponseSchema>;
