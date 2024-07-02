/**
 * @swagger
 * tags:
 *   - name: Orders
 *     description: API для управления заказами
 */

import express from 'express';
import orders from '../data/orders.js';
import autos from '../data/autos.js';
import items from '../data/items.js'

const router = express.Router();

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Получить список заказов
 *     tags:
 *       - Orders
 *     responses:
 *       '200':
 *         description: Успешный запрос. Возвращает список заказов.
 *       '404':
 *         description: Заказы не найдены.
 */
router.get('/', (req, res) => {
    res.json(orders);
});

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Получить информацию о заказе по ID
 *     tags:
 *       - Orders
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID заказа
 *     responses:
 *       '200':
 *         description: Успешный запрос. Возвращает информацию о заказе.
 *       '404':
 *         description: Заказ не найден.
 */
router.get('/:id', (req, res) => {
    const order = orders.find(o => o.id === parseInt(req.params.id));
    if (order) {
        res.json(order);
    } else {
        res.status(404).send('Order not found');
    }
});

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Создать новый заказ
 *     tags:
 *       - Orders
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               clientId:
 *                 type: integer
 *               autoId:
 *                 type: integer
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     quantity:
 *                       type: integer
 *             example:
 *               clientId: 1
 *               autoId: 10
 *               items:
 *                 - id: 22
 *                   quantity: 2
 *                 - id: 31
 *                   quantity: 1
 *                 - id: 13
 *                   quantity: 3
 *     responses:
 *       '201':
 *         description: Заказ успешно создан.
 */
router.post('/', (req, res) => {
    const newOrder = req.body;
    newOrder.id = orders.length ? orders[orders.length - 1].id + 1 : 1;

    // Проверка наличия товаров в списке autos
    const itemsNotFound = [];
    newOrder.items.forEach(item => {
        const foundAuto = items.find(obj => obj.id === item.id);
        if (!foundAuto || item.quantity > foundAuto.quantity) {
            itemsNotFound.push(item.id);
        }
    });

    if (itemsNotFound.length > 0) {
        return res.status(400).json({ error: `Товары с id ${itemsNotFound.join(', ')} не найдены или их количество недостаточно.` });
    }

    newOrder.items.forEach(item => {
        const foundItem = items.find(obj => obj.id === item.id);
        if (foundItem) {
            foundItem.quantity -= item.quantity;
            if (foundItem.quantity === 0) {
                const index = items.indexOf(foundItem);
                if (index > -1) {
                    items.splice(index, 1);
                }
            }
        }
    });

    orders.push(newOrder);
    res.status(201).json(newOrder);
});

/**
 * @swagger
 * /api/orders/client/{clientId}:
 *   get:
 *     summary: Получить заказы клиента по его clientId
 *     tags:
 *       - Orders
 *     parameters:
 *       - in: path
 *         name: clientId
 *         required: true
 *         schema:
 *           type: integer
 *           format: int64
 *         description: ID клиента для получения его заказов
 *     responses:
 *       '200':
 *         description: Успешный запрос. Возвращает список заказов клиента.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: Уникальный ID заказа
 *                   clientId:
 *                     type: integer
 *                     description: ID клиента, которому принадлежит заказ
 *                   autoId:
 *                     type: integer
 *                     description: ID автомобиля заказа
 *                   itemsId:
 *                     type: array
 *                     items:
 *                       type: integer
 *                     description: Массив ID товаров в заказе
 *                   date:
 *                     type: string
 *                     format: date
 *                     description: Дата заказа в формате "DD.MM.YYYY"
 *                   price:
 *                     type: number
 *                     format: float
 *                     description: Цена заказа
 *       '404':
 *         description: Заказы не найдены для указанного clientId.
 */
router.get('/client/:clientId', (req, res) => {
    const clientId = parseInt(req.params.clientId);

    const clientOrders = orders.filter(order => order.clientId === clientId);

    res.json(clientOrders);
});

export default router;