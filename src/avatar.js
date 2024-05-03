import axios from 'axios';
import fs from 'fs';

export async function saveAvatar(attachment, avatarName) {
    const avatarPath = `avatars/${avatarName}.png`;
    const writer = fs.createWriteStream(avatarPath);

    // Ensure avatars directory exists
    if (!fs.existsSync('avatars')) {
        fs.mkdirSync('avatars');
    }

    try {
        const response = await axios({
            url: attachment.url,
            method: 'GET',
            responseType: 'stream',
        });

        response.data.pipe(writer);

        await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });

        return avatarPath;
    } catch (error) {
        // Handle errors
        console.error('Error saving avatar:', error);
        // Clean up incomplete file if exists
        if (fs.existsSync(avatarPath)) {
            fs.unlinkSync(avatarPath);
        }
        throw new Error('Failed to save avatar');
    } finally {
        // Ensure the writer is closed and cleaned up
        writer.close();
    }
}
