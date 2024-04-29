export function isValidImageUrl(url) {
	return url.match(/http(s?):\/\/.+\.(jpeg|jpg|gif|png|webp)/) !== null;
}
