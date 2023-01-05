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
	const id = event.context.params.id;
	const speaker = await prisma.speaker
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
						statusMessage: 'Cannot find speaker to delete with given id',
					}),
				);
			}
		});
	if (speaker) {
		await prisma.speaker
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
							statusMessage: 'Cannot delete speaker with given id',
						}),
					);
				}
			});
	}
	return true;
});
