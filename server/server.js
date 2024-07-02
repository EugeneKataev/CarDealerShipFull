
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';

import itemsRoutes from './routes/items.js';
import clientsRoutes from './routes/clients.js';
import autosRoutes from './routes/autos.js';
import ordersRoutes from './routes/orders.js';
import autoDealsRouter from './routes/autoDeals.js';

import swaggerSpec from './swagger.js';

const app = express();

app.use(cors());

const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/items', itemsRoutes);
app.use('/api/clients', clientsRoutes);
app.use('/api/auto', autosRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/autodeals', autoDealsRouter);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});