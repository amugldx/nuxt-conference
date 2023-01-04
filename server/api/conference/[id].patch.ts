import { serverSupabaseUser } from '#supabase/server';
import { prisma } from '~~/server/db';
import { updateConferenceBody } from '../../validation/conference.validate';

export default defineEventHandler(async event => {
	const user = await serverSupabaseUser(event);
	if (!user) {
		return sendError(
			event,
			createError({
				statusCode: 400,
				statusMessage: 'You need to be logged in to create conference',
			}),
		);
	}
	const userId = user.id;
	const id = event.context.params.id;
	const { title, date, location, description_points, description_full, seats } =
		await readBody(event);
	const conferenceObject: updateConferenceBody = {
		title,
		date,
		location,
		description_points,
		description_full,
		seats,
	};
	const conference = await prisma.conference.findUnique({
		where: {
			id,
		},
	});
	if (!conference || conference.userId !== userId) {
		sendError(
			event,
			createError({
				statusCode: 404,
				statusMessage: 'Conference with given id does not exists',
			}),
		);
	}
	const updatedConference = await prisma.conference.update({
		where: {
			id,
		},
		data: {
			...conferenceObject,
		},
	});
	return updatedConference;
});
