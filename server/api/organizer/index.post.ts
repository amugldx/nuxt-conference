import { serverSupabaseUser } from '#supabase/server';
import { prisma } from '~~/server/db';
import {
	organizerBody,
	checkOrganizerValidation,
} from '../../validation/organizer.validate';

export default defineEventHandler(async event => {
	const user = await serverSupabaseUser(event);
	if (!user) {
		return sendError(
			event,
			createError({
				statusCode: 400,
				statusMessage: 'You need to be logged in to create organizer',
			}),
		);
	}
	const { logo, name, website, conferenceId } = await readBody(event);
	if (!name || !logo || !website || !conferenceId) {
		return sendError(
			event,
			createError({
				statusCode: 400,
				statusMessage: 'invalid body',
			}),
		);
	}
	const organizerObject: organizerBody = {
		logo,
		name,
		website,
		conferenceId,
	};
	checkOrganizerValidation(organizerObject);
	const organizer = await prisma.organizer
		.create({
			data: {
				logo: organizerObject.logo,
				name: organizerObject.name,
				website: organizerObject.website,
				conferenceId: organizerObject.conferenceId,
			},
		})
		.catch(error => {
			if (error) {
				sendError(
					event,
					createError({
						statusCode: 400,
						statusMessage: 'Unable to create organizer',
					}),
				);
			}
		});
	return organizer;
});
