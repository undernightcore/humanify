export function omitKey(obj: { [key: string]: any }, keyToOmit: string) {
	return Object.fromEntries(Object.entries(obj).filter(([key]) => key !== keyToOmit));
}
