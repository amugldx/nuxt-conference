import { prisma } from '~~/server/db';

export default defineEventHandler(async event => {
	const id = event.context.params.id;
	const organizers = await prisma.conference
		.findUnique({
			where: {
				id,
			},
			select: {
				organizers: true,
			},
		})
		.catch(error => {
			if (error) {
				sendError(
					event,
					createError({
						statusCode: 404,
						statusMessage: 'Cannot find organizers with given id',
					}),
				);
			}
		});
	return organizers;
});
