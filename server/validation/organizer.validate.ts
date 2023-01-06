import { z } from 'zod';

const createOrganizerSchema = z.object({
	logo: z.string(),
	name: z.string(),
	website: z.string().url(),
	conferenceId: z.string().uuid(),
});

export const checkOrganizerValidation = (organizerObject: organizerBody) => {
	const result = createOrganizerSchema.safeParse(organizerObject);
	if (result.success === false) {
		return result.error.message;
	}
	return result.data;
};

export type organizerBody = z.infer<typeof createOrganizerSchema>;

const upadateOrganizerSchema = z.object({
	logo: z.string().optional(),
	name: z.string().optional(),
	website: z.string().url().optional(),
});

export const checkUpdatedOrganizerValidation = (
	organizerObject: updateOrganizerBody,
) => {
	const result = upadateOrganizerSchema.safeParse(organizerObject);
	if (result.success === false) {
		return result.error.message;
	}
	return result.data;
};

export type updateOrganizerBody = z.infer<typeof upadateOrganizerSchema>;
