import { serverSupabaseUser } from '#supabase/server';
import { prisma } from '~~/server/db';

export default defineEventHandler(async event => {
	const user = await serverSupabaseUser(event);
	if (!user) {
		return sendError(
			event,
			createError({
				statusCode: 400,
				statusMessage: 'You need to be logged in to delete organizer',
			}),
		);
	}
	const id = event.context.params.id;
	const organizer = await prisma.organizer
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
						statusMessage: 'Cannot find organizer to delete with given id',
					}),
				);
			}
		});
	if (organizer) {
		await prisma.organizer
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
							statusMessage: 'Cannot delete organizer with given id',
						}),
					);
				}
			});
	}
	return true;
});
