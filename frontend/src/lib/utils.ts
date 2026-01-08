export const arraysEqual = (arr1: string[], arr2: string[]): boolean => {
	const set1 = new Set(arr1);
	const set2 = new Set(arr2);

	// check for duplicates
	if (set1.size !== set2.size) return false;

	return [...set1].every((el) => set2.has(el));
};
