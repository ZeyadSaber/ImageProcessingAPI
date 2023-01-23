import path from 'path';
import { resizeImage } from '../../utils/utils';

const imagePath = path.resolve(__dirname, '../../../assets/images/fjord.jpg');
const resizedImagePath = path.resolve(
	__dirname,
	'../../../assets/resized_images/fjord.jpg'
);

describe('The imageResizer function', (): void => {
	it('returns a buffer after sucessfully resizing an image', async () => {
		const imageBuffer: Buffer = await resizeImage({
			height: 100,
			width: 150,
			imagePath,
			resizedImagePath,
		});
		expect(imageBuffer).toBeInstanceOf(Buffer);
	});

	it('rejects promise if something went wrong', async (): Promise<void> => {
		await expectAsync(
			resizeImage({
				height: 100,
				width: 150,
				imagePath: 'random path',
				resizedImagePath,
			})
		).toBeRejected();
	});
});
