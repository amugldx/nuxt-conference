import { serverSupabaseUser } from '#supabase/server';
import { prisma } from '~~/server/db';

export default defineEventHandler(async event => {
	const user = await serverSupabaseUser(event);
	if (!user) {
		return sendError(
			event,
			createError({
				statusCode: 400,
				statusMessage: 'You need to be logged in to delete conference',
			}),
		);
	}
	const userId = user.id;
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
						statusMessage: 'Cannot find conference to delete with given id',
					}),
				);
			}
		});
	if (conference && conference.userId === userId) {
		await prisma.conference
			.delete({
				where: {
					id,
				},
			})
			.catch(error => {
				if (error) {
					sendError(
						event,
						createError({
							statusCode: 400,
							statusMessage: 'Cannot delete conference with given id',
						}),
					);
				}
			});
	}
	return true;
});
