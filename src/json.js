import { writeFileSync, readFileSync, existsSync } from 'fs';

const FORMAT = 'utf8';
const JSON_EXT = '.json';
const JSON_INDENT = 2;

export function saveJson(fileName, data) {
	const json = JSON.stringify(data, null, JSON_INDENT);
	writeFileSync(fileName + JSON_EXT, json, FORMAT);
}

export function loadJson(fileName) {
	const data = readFileSync(fileName + JSON_EXT, FORMAT);
	return JSON.parse(data);
}

export function existsJson(fileName) {
	return existsSync(fileName + JSON_EXT);
}
