/**
 * @swagger
 * tags:
 *   - name: Clients
 *     description: API для управления клиентами
 */

import express from 'express';
import clients from '../data/clients.js';

const router = express.Router();

/**
 * @swagger
 * /api/clients:
 *   get:
 *     summary: Получить список клиентов
 *     tags:
 *       - Clients
 *     responses:
 *       '200':
 *         description: Успешный запрос. Возвращает список клиентов.
 *       '404':
 *         description: Клиенты не найдены.
 */
router.get('/', (req, res) => {
    res.json(clients);
});

/**
 * @swagger
 * /api/clients/{id}:
 *   get:
 *     summary: Получить информацию о клиенте по ID
 *     tags:
 *       - Clients
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID клиента
 *     responses:
 *       '200':
 *         description: Успешный запрос. Возвращает информацию о клиенте.
 *       '404':
 *         description: Клиент не найден.
 */
router.get('/:id', (req, res) => {
    const client = clients.find(c => c.id === parseInt(req.params.id));
    if (client) {
        res.json(client);
    } else {
        res.status(404).send('Client not found');
    }
});

/**
 * @swagger
 * /api/clients:
 *   post:
 *     summary: Создать нового клиента
 *     tags:
 *       - Clients
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *             example:
 *               name: Шарапова
 *               phone: +2482393847
 *     responses:
 *       '201':
 *         description: Клиент успешно создан.
 */
router.post('/', (req, res) => {
    const newClient = req.body;
    newClient.id = clients.length ? clients[clients.length - 1].id + 1 : 1;
    newClient.autos = [];
    clients.push(newClient);
    res.status(201).json(newClient);
});

/**
 * @swagger
 * /api/clients/{id}:
 *   put:
 *     summary: Обновить информацию о клиенте по ID
 *     tags:
 *       - Clients
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID клиента
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *             example:
 *               name: Джокович
 *               phone: +132424523
 *     responses:
 *       '200':
 *         description: Информация о клиенте успешно обновлена.
 *       '404':
 *         description: Клиент не найден.
 */
router.put('/:id', (req, res) => {
    const clientId = parseInt(req.params.id);
    const updatedClient = req.body;

    const index = clients.findIndex(client => client.id === clientId);
    if (index !== -1) {
        clients[index].name = updatedClient.name;
        clients[index].phone = updatedClient.phone;

        // Обновление по авто
        if (updatedClient.autos) {
            clients[index].autos = updatedClient.autos;
        }

        res.json(clients[index]);
    } else {
        res.status(404).send('Client not found');
    }
});

export default router;