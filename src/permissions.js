
const ADMIN_ID = process.env.ADMIN_ID;

export function canModify(author, owner) {
	// If the author is admin, they can modify any model
	if (author === ADMIN_ID) return true;

	return author === owner;
}
