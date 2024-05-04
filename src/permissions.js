
const { ADMIN_ID } = process.env;

export function canModify(author, owner) {
	// If the author is admin, they can modify any model
	if (isAdmin(author)) return true;

	return author === owner;
}

export function isAdmin(author) {
	return author === ADMIN_ID;
}
