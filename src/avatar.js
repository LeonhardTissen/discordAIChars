import { saveImage } from "./utils/imagesave.js";

export async function saveAvatar(attachment, avatarName) {
    const avatarPath = await saveImage(attachment.url, avatarName, 'avatars');

    return avatarPath;
}
