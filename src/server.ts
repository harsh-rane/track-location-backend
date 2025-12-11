import expess from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';

import router from './routes/locationRoutes';
const app = expess();
const corsOptions = {
    origin: ['http://localhost:3000', 'https://track-location-puce.vercel.app/'],
}
app.use(expess.json());
app.use(cors(corsOptions));

app.get('/', (req: Request, res: Response) => {
    return res.json({ message: 'Hello World' });
});

app.use('/api', router);

export default app