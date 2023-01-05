import { serverSupabaseUser } from '#supabase/server';
import { prisma } from '~~/server/db';
import {
	checkSpeakerValidation,
	speakerBody,
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
	const { name, image, position, company, about, time, topic, conferenceId } =
		await readBody(event);
	if (
		!name ||
		!image ||
		!position ||
		!company ||
		!about ||
		!time ||
		!topic ||
		!conferenceId
	) {
		return sendError(
			event,
			createError({
				statusCode: 400,
				statusMessage: 'invalid body',
			}),
		);
	}
	const speakerObject: speakerBody = {
		name,
		image,
		position,
		company,
		about,
		time,
		topic,
		conferenceId,
	};
	checkSpeakerValidation(speakerObject);
	const speaker = await prisma.speaker
		.create({
			data: {
				name: speakerObject.name,
				image: speakerObject.image,
				position: speakerObject.position,
				company: speakerObject.company,
				about: speakerObject.about,
				conferenceId: speakerObject.conferenceId,
				Schedule: {
					create: {
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
						statusMessage: 'Unable to create Speaker',
					}),
				);
			}
		});
	return speaker;
});
