import express from 'express';
import * as utils from '../../utils/utils';
import { Stats } from 'fs';
import fs from 'fs/promises';
import path from 'path';

const images = express.Router();

images.get(
	'/',
	async (req: express.Request, res: express.Response): Promise<void> => {
		// check if all parameters are correct.
		const paramsCheck = utils.validateParams(req);
		if (!paramsCheck[0]) {
			res.status(400).send(paramsCheck[1] as string);
			return;
		}

		//query parameters
		const filename = req.query['file_name'] as string;
		const width = parseInt(req.query['width'] as string);
		const height = parseInt(req.query['height'] as string);

		//get image path from the query.
		const imagePath = `${path.resolve(
			__dirname,
			`../../../assets/images/${filename}.jpg`
		)}`;

		//check if image exists.
		const fullImage: Stats | null = await fs.stat(imagePath).catch(() => {
			res.status(404).send('Image does not exist');
			return null;
		});

		if (!fullImage) {
			return;
		}

		//get resized image path to check if it is already created.
		const resizedImagePath = `${path.resolve(
			__dirname,
			`../../../assets/resized_images/${filename}${height}h${width}w.jpg`
		)}`;

		//check if resized image already created
		const resizedImage: Stats | null = await fs
			.stat(resizedImagePath)
			.catch(() => {
				return null;
			});

		//return resized image directly if exists
		// if not, resize it then return it.
		if (resizedImage) {
			fs.readFile(resizedImagePath)
				.then((imageBuffer: Buffer) => {
					res.status(200).contentType('jpg').send(imageBuffer);
				})
				.catch(() => {
					res.status(500).send('Error occured while returning resized image');
				});
		} else {
			// resize image
			utils
				.resizeImage({
					imagePath,
					resizedImagePath,
					width,
					height,
				})
				.then((resizedImage: Buffer) => {
					res.status(200).contentType('jpg').send(resizedImage);
				})
				.catch(() => {
					res.status(500).send('Error occured while resizing the image');
				});
		}
	}
);

export default images;
