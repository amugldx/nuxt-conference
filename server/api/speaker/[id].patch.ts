import { serverSupabaseUser } from '#supabase/server';
import { prisma } from '~~/server/db';
import {
	updateSpeakerBody,
	checkUpdatedSpeakerValidation,
} from '../../validation/speaker.validate';

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
	const { name, image, position, company, about, time, topic } = await readBody(
		event,
	);
	const id = event.context.params.id;
	const speakerObject: updateSpeakerBody = {
		name,
		image,
		position,
		company,
		about,
		time,
		topic,
	};
	checkUpdatedSpeakerValidation(speakerObject);
	const speaker = await prisma.speaker.findUnique({
		where: {
			id,
		},
	});
	if (!speaker) {
		sendError(
			event,
			createError({
				statusCode: 404,
				statusMessage: 'Speaker with given id does not exists',
			}),
		);
	}
	const updatedSpeaker = await prisma.speaker
		.update({
			where: {
				id,
			},
			data: {
				name: speakerObject.name,
				image: speakerObject.image,
				position: speakerObject.position,
				company: speakerObject.company,
				about: speakerObject.about,
				Schedule: {
					update: {
						time: speakerObject.time,
						topic: speakerObject.topic,
					},
				},
			},
			include: {
				Schedule: true,
			},
		})
		.catch(error => {
			if (error) {
				sendError(
					event,
					createError({
						statusCode: 400,
						statusMessage: 'Unable to update Speaker',
					}),
				);
			}
		});
	return updatedSpeaker;
});
