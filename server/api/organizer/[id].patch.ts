import { serverSupabaseUser } from '#supabase/server';
import { prisma } from '~~/server/db';
import {
	checkUpdatedOrganizerValidation,
	updateOrganizerBody,
} from '~~/server/validation/organizer.validate';

export default defineEventHandler(async event => {
	const user = await serverSupabaseUser(event);
	if (!user) {
		return sendError(
			event,
			createError({
				statusCode: 400,
				statusMessage: 'You need to be logged in to update organizer',
			}),
		);
	}
	const { name, logo, website } = await readBody(event);
	const id = event.context.params.id;
	const organizerObject: updateOrganizerBody = {
		name,
		logo,
		website,
	};
	checkUpdatedOrganizerValidation(organizerObject);
	const organizer = await prisma.organizer.findUnique({
		where: {
			id,
		},
	});
	if (!organizer) {
		sendError(
			event,
			createError({
				statusCode: 404,
				statusMessage: 'Organizer with given id does not exists',
			}),
		);
	}
	const updatedOrganizer = await prisma.organizer
		.update({
			where: {
				id,
			},
			data: {
				name: organizerObject.name,
				logo: organizerObject.logo,
				website: organizerObject.website,
			},
		})
		.catch(error => {
			if (error) {
				sendError(
					event,
					createError({
						statusCode: 400,
						statusMessage: 'Unable to update Organizer',
					}),
				);
			}
		});
	return updatedOrganizer;
});
