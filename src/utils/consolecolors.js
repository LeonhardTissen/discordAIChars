const colorCodes = {
	Black: 30,
	Red: 31,
	Green: 32,
	Yellow: 33,
	Blue: 34,
	Magenta: 35,
	Cyan: 36,
	White: 37,
	Gray: 90
}

export const color = {}

for (const [name, code] of Object.entries(colorCodes)) {
	color[name] = `\x1b[${code}m`
}
