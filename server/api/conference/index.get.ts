import { prisma } from '~~/server/db';

export default defineEventHandler(async event => {
	const conferences = await prisma.conference
		.findMany({
			include: {
				speakers: true,
				organizers: true,
			},
		})
		.catch(error => {
			if (error) {
				sendError(
					event,
					createError({
						statusCode: 404,
						statusMessage: 'Unable to find conferences',
					}),
				);
			}
		});
	return conferences;
});
