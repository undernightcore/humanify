import type { RequestHandler } from '@sveltejs/kit';
import { getAuthenticatedUser } from '$lib/server/helpers/auth.helper';
import { validatePaginationParams } from '$lib/server/validators/pagination.validator';
import { prisma } from '$lib/server/services/prisma.service';
import { omitKey } from '$lib/server/helpers/object.helper';
import type { User } from '@prisma/client';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ request, url }) => {
	const user = await getAuthenticatedUser(request);

	const { page, perPage } = validatePaginationParams(Object.fromEntries(url.searchParams));

	const chats = (
		await prisma.chat.findMany({
			...(!user.admin
				? {
						where: {
							userId: user.id
						}
				  }
				: {}),
			skip: (page - 1) * perPage,
			take: perPage,
			include: { user: true }
		})
	).map((chat) => ({ ...chat, user: omitKey(chat.user, 'password') as Omit<User, 'password'> }));

	return json(chats);
};
