import { Application, Request, Response } from 'express';
import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';
import router from './app/routes';
import notFound from './app/middleware/notFound';


const app: Application = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(cors({ origin: ["*",'http://localhost:5173'] }));





app.use('/api/v1', router);
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.use(notFound);
export default app;
