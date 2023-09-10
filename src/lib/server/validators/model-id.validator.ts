import { number, preprocess } from 'zod';
import { error } from '@sveltejs/kit';
import { ZodError } from 'zod';

const schema = preprocess(
	(value) => Number(value),
	number({ invalid_type_error: 'modelId should be a number' })
)

export function validateModelId(params: any) {
	try {
		return schema.parse(params);
	} catch (e) {
		if (e instanceof ZodError) {
			const errors = e.issues.map((issue) => issue.message);
			throw error(400, { message: errors[0] });
		} else {
			throw error(500, { message: 'Something went wrong' });
		}
	}
}
