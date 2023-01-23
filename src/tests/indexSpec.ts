import supertest from 'supertest';
import app from '../index';

const request = supertest(app);

describe('Account test suite', () => {
	it('get /', (done): void => {
		request.get('/').expect(200);
		done();
	});
});
