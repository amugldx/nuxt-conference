import { serverSupabaseUser } from '#supabase/server';
import { prisma } from '~~/server/db';
import {
	checkConferenceValidation,
	conferenceBody,
} from '../../validation/conference.validate';

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
	const { title, date, location, description_points, description_full, seats } =
		await readBody(event);
	if (
		!title ||
		!date ||
		!location ||
		!description_points ||
		!description_full ||
		!seats
	) {
		return sendError(
			event,
			createError({
				statusCode: 400,
				statusMessage: 'invalid body',
			}),
		);
	}
	const conferenceObject: conferenceBody = {
		title,
		date,
		location,
		description_points,
		description_full,
		seats,
	};
	checkConferenceValidation(conferenceObject);
	const conference = await prisma.conference
		.create({
			data: {
				userId: userId,
				title: conferenceObject.title,
				date: conferenceObject.date,
				location: conferenceObject.location,
				description_points: conferenceObject.description_points,
				description_full: conferenceObject.description_full,
				seats: conferenceObject.seats,
			},
		})
		.catch(error => {
			if (error) {
				sendError(
					event,
					createError({
						statusCode: 400,
						statusMessage: 'Unable to create conference',
					}),
				);
			}
		});
	return conference;
});
