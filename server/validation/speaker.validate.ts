import { z } from 'zod';

const createSpeakerSchema = z.object({
	name: z.string(),
	image: z.string().url(),
	position: z.string(),
	company: z.string(),
	about: z.string(),
	time: z.string().datetime(),
	topic: z.string(),
	conferenceId: z.string().uuid(),
});

export const checkSpeakerValidation = (speakerObject: speakerBody) => {
	const result = createSpeakerSchema.safeParse(speakerObject);
	if (result.success === false) {
		return result.error.message;
	}
	return result.data;
};

export type speakerBody = z.infer<typeof createSpeakerSchema>;

const updateSpeakerSchema = z.object({
	name: z.string().optional(),
	image: z.string().url().optional(),
	position: z.string().optional(),
	company: z.string().optional(),
	about: z.string().optional(),
	time: z.string().datetime().optional(),
	topic: z.string().optional(),
});

export const checkUpdatedSpeakerValidation = (
	speakerObject: updateSpeakerBody,
) => {
	const result = updateSpeakerSchema.safeParse(speakerObject);
	if (result.success === false) {
		return result.error.message;
	}
	return result.data;
};

export type updateSpeakerBody = z.infer<typeof updateSpeakerSchema>;
