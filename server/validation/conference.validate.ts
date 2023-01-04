import { z } from 'zod';

const createConferenceSchema = z.object({
	title: z.string(),
	date: z.string().datetime(),
	location: z.string(),
	description_points: z.array(z.string()),
	description_full: z.string(),
	seats: z.number(),
});

export const checkConferenceValidation = (conferenceObject: conferenceBody) => {
	const result = createConferenceSchema.safeParse(conferenceObject);
	if (result.success === false) {
		return result.error.message;
	}
	return result.data;
};

export type conferenceBody = z.infer<typeof createConferenceSchema>;

const updateConferenceSchema = z.object({
	title: z.string().optional(),
	date: z.string().datetime().optional(),
	location: z.string().optional(),
	description_points: z.array(z.string()).optional(),
	description_full: z.string().optional(),
	seats: z.number().optional(),
});

export const checkUpdatedConferenceValidation = (
	conferenceObject: conferenceBody,
) => {
	const result = updateConferenceSchema.safeParse(conferenceObject);
	if (result.success === false) {
		return result.error.message;
	}
	return result.data;
};

export type updateConferenceBody = z.infer<typeof updateConferenceSchema>;
