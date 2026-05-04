import { Request, Response } from 'express';
import app from "./app";
import { env } from './env';
import { initOrderCron } from './modules/orders/orders.cron';

const PORT = env.PORT;

app.get('/', (req: Request, res: Response) => {
    res.status(200).json({ message: 'Mobile app- server is running!!!' });
});

app.use((req: Request, res: Response) => {
    res.status(404).json({ message: 'Not Found!' });
});

app.listen(PORT, () => {
    initOrderCron();
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});