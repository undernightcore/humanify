import type { RequestHandler } from '@sveltejs/kit';
import { error, json } from '@sveltejs/kit';
import { getAuthenticatedUser } from '$lib/server/helpers/auth.helper';
import { prisma } from '$lib/server/services/prisma.service';
import { validateModelId } from '$lib/server/validators/model-id.validator';
import { validateCreateModelRequest } from '$lib/server/validators/create-model.validator';

export const DELETE: RequestHandler = async ({ request, params }) => {
	const user = await getAuthenticatedUser(request);
	if (!user.admin) throw error(403, 'You need to be an admin to delete models');

	const modelId = validateModelId(params.modelId);

	await prisma.model.delete({
		where: {
			id: modelId
		}
	});

	return json({ message: 'Model deleted successfully' });
};

export const PUT: RequestHandler = async ({ request, params }) => {
	const user = await getAuthenticatedUser(request);
	if (!user.admin) throw error(403, 'You need to be an admin to edit models');

	const modelId = validateModelId(params.modelId);
	const data = validateCreateModelRequest(await request.json());

	await prisma.model.update({
		where: {
			id: modelId
		},
		data
	});

	return json({ message: 'Model edited successfully' });
};
