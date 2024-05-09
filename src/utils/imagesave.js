import axios from 'axios';
import fs from 'fs';

async function downloadImage(url) {
	const response = await axios({
		url,
		method: 'GET',
		responseType: 'stream',
	});

	return response.data;
}

function createDirectoryIfNotExists(directory) {
	if (!fs.existsSync(directory)) {
		fs.mkdirSync(directory);
	}
}

export async function saveImage(url, imageName, directory) {
	const imagePath = `${directory}/${imageName}.png`;
	const writer = fs.createWriteStream(imagePath);

	createDirectoryIfNotExists(directory);

	try {
        const imageData = await downloadImage(url);

        imageData.pipe(writer);

        await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });

        return imagePath;
    } catch (error) {
        // Handle errors
        console.error('Error saving image:', error);

        // Clean up incomplete file if exists
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        throw new Error('Failed to save image');
    } finally {
        // Ensure the writer is closed and cleaned up
        writer.close();
    }
}
