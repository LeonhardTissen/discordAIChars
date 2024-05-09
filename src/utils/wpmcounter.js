import { color } from "../utils/consolecolors.js";

export class WPMCounter {
	constructor() {
		this.start = Date.now();
	}

	totalTimeToGenerate() {
		return (Date.now() - this.start) / 1000;
	}

	wordsPerMinute(generatedResult) {
		const timeToGenerate = this.totalTimeToGenerate();
		const wordCount = generatedResult.split(' ').length;
		return Math.round((wordCount / timeToGenerate) * 60);
	}

	logTimeAndWPM(generatedResult) {
		const timeToGenerate = this.totalTimeToGenerate();
		const wordsPerMinute = this.wordsPerMinute(generatedResult);

		console.log(`${color.Blue}Time to generate: ${timeToGenerate}s, Words per minute: ${wordsPerMinute}`);
	}
}
