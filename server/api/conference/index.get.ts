import { serverSupabaseUser } from '#supabase/server';
import { prisma } from '~~/server/db';

export default defineEventHandler(async event => {
	const user = await serverSupabaseUser(event);
	if (!user) {
		return 'No Conferences for given user';
	}
	const userId = user.id;
	const conferences = await prisma.conference
		.findMany({
			where: {
				userId,
			},
			include: {
				speakers: {
					include: {
						Schedule: true,
					},
				},
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
