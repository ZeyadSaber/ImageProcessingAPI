import express from 'express';
import fs from 'fs/promises';
import sharp from 'sharp';

// check if all parameters are in the request;
const validateParams = (request: express.Request): [boolean, string] => {
	try {
		if (
			!request.query.file_name &&
			!request.query.width &&
			!request.query.height
		) {
			return [true, 'INDEX'];
		} else if (!request.query.file_name) {
			return [false, 'File name is missing.'];
		} else if (!request.query.width) {
			return [false, 'File width is missing.'];
		} else if (!request.query.height) {
			return [false, 'File height is missing.'];
		} else {
			return [
				true,
				`${request.query.file_name}${request.query.width}${request.query.height}`,
			];
		}
	} catch (err) {
		return [false, 'Error Occurred'];
	}
};

// Resized Image properties
interface ResizedImage {
	imagePath: string;
	resizedImagePath: string;
	width: number;
	height: number;
}

// resize image of given Image path and dimensions and saves it in resized images path.
// returns image buffer on success.
const resizeImage = async ({
	imagePath,
	resizedImagePath,
	width,
	height,
}: ResizedImage): Promise<Buffer> => {
	const image: Buffer | null = await fs.readFile(imagePath).catch(() => null);
	const imageBuffer: Buffer | null = await sharp(image)
		.resize(width, height)
		.toBuffer()
		.catch(() => null);

	if (!imageBuffer) {
		return Promise.reject();
	}
	return fs
		.writeFile(resizedImagePath, imageBuffer)
		.then(() => {
			return imageBuffer;
		})
		.catch(() => {
			return Promise.reject();
		});
};

export { resizeImage, validateParams };
