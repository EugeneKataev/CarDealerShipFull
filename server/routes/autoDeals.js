import express from 'express';
const router = express.Router();

import autoDeals from '../data/autoDeals.js';
import clients from '../data/clients.js';
import autos from '../data/autos.js';
import orders from "../data/orders.js";

/**
 * @swagger
 * tags:
 *   - name: AutoDeals
 *     description: API для управления автосделками
 */

/**
 * @swagger
 * /api/autodeals:
 *   get:
 *     summary: Получить список всех автосделок
 *     tags: [AutoDeals]
 *     responses:
 *       '200':
 *         description: Успешный запрос. Возвращает список всех автосделок.
 *       '404':
 *         description: Автосделки не найдены.
 */
router.get('/', (req, res) => {
    res.json(autoDeals);
});

/**
 * @swagger
 * /api/autodeals:
 *   post:
 *     summary: Создать новую автосделку и добавить автомобиль клиенту
 *     tags: [AutoDeals]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               clientId:
 *                 type: integer
 *                 description: ID клиента
 *               autoId:
 *                 type: integer
 *                 description: ID автомобиля
 *               price:
 *                 type: number
 *                 description: Цена автосделки
 *               date:
 *                 type: string
 *                 description: Дата автосделки в формате "DD.MM.YYYY"
 *             example:
 *               clientId: 2
 *               autoId: 3
 *               price: 2500
 *               date: "02.12.2023"
 *     responses:
 *       '201':
 *         description: Автосделка успешно создана и автомобиль добавлен к клиенту.
 */
router.post('/', (req, res) => {
    const { clientId, autoId, price, date, modelType, year } = req.body;

    // Находим клиента по ID
    const client = clients.find(c => c.id === clientId);
    if (!client) {
        return res.status(404).json({ message: `Клиент с ID ${clientId} не найден` });
    }

    // Находим автомобиль по ID
    const auto = autos.find(a => a.id === autoId);
    if (!auto) {
        return res.status(404).json({ message: `Автомобиль с ID ${autoId} не найден` });
    }

    // Пример создания новой автосделки
    const newAutoDeal = { clientId, autoId, price, date };
    autoDeals.push(newAutoDeal);

    // Добавляем автомобиль к клиенту в его массив autos
    client.autos.push({ id: auto.id, modelType: auto.modelType, year: auto.year });

    newAutoDeal.id = orders.length ? orders[orders.length - 1].id + 1 : 1;
    newAutoDeal.autoBuy = true;
    newAutoDeal.modelType = modelType;
    newAutoDeal.year = year;
    orders.push(newAutoDeal);

    res.status(201).json(newAutoDeal);
});

export default router;