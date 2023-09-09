import type { RequestHandler } from '@sveltejs/kit';
import { validateLoginRequest } from '$lib/server/validators/login.validator';
import { prisma } from '$lib/server/services/prisma.service';
import { isValidPassword } from '$lib/server/helpers/bcrypt.helper';
import { error, json } from '@sveltejs/kit';
import { generateUserJwt } from '$lib/server/helpers/jwt.helper';
export const POST: RequestHandler = async ({ request }) => {
	const { email, password } = validateLoginRequest(await request.json());

	const user = await prisma.user.findUnique({
		where: {
			email
		}
	});

	if (!user) throw error(401, { message: 'This credentials are wrong' });
	const validPassword = await isValidPassword(password, user.password);
	if (!validPassword) throw error(401, { message: 'This credentials are wrong' });

	const token = generateUserJwt(user);
	return json({ token });
};
