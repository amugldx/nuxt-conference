import { prisma } from '~~/server/db';

export default defineEventHandler(async event => {
	const id = event.context.params.id;
	const conference = await prisma.conference
		.findUnique({
			where: {
				id,
			},
		})
		.catch(error => {
			if (error) {
				sendError(
					event,
					createError({
						statusCode: 404,
						statusMessage: 'Cannot find conference with given id',
					}),
				);
			}
		});
	return conference;
});
