import express from 'express';
import routes from './routes/index';

// instantiation of Express object and setting up an initial port.
const app = express();
const port = 3000;

app.use('/api', express.json(), routes);

app.get('/', (_, res: express.Response): void => {
	res.status(200);
});

// App port check.
app.listen(port, (): void => {
	console.log(`Server started at http://localhost:${port}`);
});

export default app;
