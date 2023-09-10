import { object, string } from 'zod';
import { error } from '@sveltejs/kit';
import { ZodError } from 'zod';

const schema = object({
	name: string({ required_error: 'You need to give the model a name to display'}),
	description: string({ required_error: 'A description is required' }),
	modelName: string({ required_error: 'You need to indicate what is the name of the model' })
});

export function validateCreateModelRequest(body: any) {
	try {
		return schema.parse(body);
	} catch (e) {
		if (e instanceof ZodError) {
			const errors = e.issues.map((issue) => issue.message);
			throw error(400, { message: errors[0] });
		} else {
			throw error(500, { message: 'Something went wrong' });
		}
	}
}
