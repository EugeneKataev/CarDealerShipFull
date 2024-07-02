/**
 * @swagger
 * tags:
 *   - name: Items
 *     description: API для управления товарами
 */

import express from 'express';
import items from '../data/items.js';

const router = express.Router();

/**
 * @swagger
 * /api/items:
 *   get:
 *     summary: Получить список товаров
 *     tags:
 *       - Items
 *     responses:
 *       '200':
 *         description: Успешный запрос. Возвращает список товаров.
 *       '404':
 *         description: Товары не найдены.
 */
router.get('/', (req, res) => {
    res.json(items);
});

/**
 * @swagger
 * /api/items/all-models:
 *   get:
 *     summary: Получить уникальные модели из свойства compatibleModels всех товаров
 *     tags:
 *       - Items
 *     responses:
 *       '200':
 *         description: Успешный запрос. Возвращает массив уникальных моделей.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *                 example: "Nissan Altima"
 *                 description: Уникальная модель автомобиля из свойства compatibleModels товаров.
 */
router.get('/all-models', (req, res) => {
    const uniqueModels = [];

    items.forEach(item => {
        const compatibleModels = item.compatibleModels;

        compatibleModels.forEach(model => {
            if (!uniqueModels.includes(model)) {
                uniqueModels.push(model);
            }
        });
    });
    res.json(uniqueModels);

});

/**
 * @swagger
 * /api/items/{id}:
 *   get:
 *     summary: Получить информацию о товаре по ID
 *     tags:
 *       - Items
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID товара
 *     responses:
 *       '200':
 *         description: Успешный запрос. Возвращает информацию о товаре.
 *       '404':
 *         description: Товар не найден.
 */
router.get('/:id', (req, res) => {
    const item = items.find(i => i.id === parseInt(req.params.id));
    if (item) {
        res.json(item);
    } else {
        res.status(404).send('Item not found');
    }
});

/**
 * @swagger
 * /api/items:
 *   post:
 *     summary: Создать новый товар
 *     tags:
 *       - Items
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               compatibleModels:
 *                 type: array
 *                 items:
 *                   type: string
 *               price:
 *                 type: number
 *               quantity:
 *                 type: integer
 *             example:
 *               name: Стекло
 *               description: Описание товара
 *               compatibleModels:
 *                 - "Audi A4"
 *                 - "Mercedes C-Class"
 *                 - "Volkswagen Golf"
 *               price: 200
 *               quantity: 3
 *     responses:
 *       '201':
 *         description: Товар успешно создан.
 */
router.post('/', (req, res) => {
    const newItem = req.body;
    newItem.id = items.length ? items[items.length - 1].id + 1 : 1;
    items.push(newItem);
    res.status(201).json(newItem);
});

/**
 * @swagger
 * /api/items/{id}:
 *   put:
 *     summary: Обновить информацию о товаре по ID
 *     tags:
 *       - Items
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID товара
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               compatibleModels:
 *                 type: string
 *               price:
 *                 type: number
 *               quantity:
 *                 type: integer
 *             example:
 *               name: Стекло для BMW
 *               description: Описание товара
 *               compatibleModels:
 *                 - "Audi A4"
 *                 - "Nissan G7"
 *               price: 250
 *               quantity: 5
 *     responses:
 *       '200':
 *         description: Информация о товаре успешно обновлена.
 *       '404':
 *         description: Товар не найден.
 */
router.put('/:id', (req, res) => {
    const index = items.findIndex(i => i.id === parseInt(req.params.id));
    if (index !== -1) {
        items[index] = req.body;
        items[index].id = parseInt(req.params.id);  // Ensure the ID remains unchanged
        res.json(items[index]);
    } else {
        res.status(404).send('Item not found');
    }
});

/**
 * @swagger
 * /api/items/{id}:
 *   delete:
 *     summary: Удалить товар по ID
 *     tags:
 *       - Items
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID товара
 *     responses:
 *       '204':
 *         description: Товар успешно удален.
 *       '404':
 *         description: Товар не найден.
 */
router.delete('/:id', (req, res) => {
    const index = items.findIndex(i => i.id === parseInt(req.params.id));
    if (index !== -1) {
        items.splice(index, 1);
        res.status(204).send();
    } else {
        res.status(404).send('Item not found');
    }
});

/**
 * @swagger
 * /api/items/models/{model}:
 *   get:
 *     summary: Получить список товаров по модели с фильтром по цене
 *     tags:
 *       - Items
 *     parameters:
 *       - in: path
 *         name: model
 *         required: true
 *         schema:
 *           type: string
 *         description: Модель автомобиля для фильтрации товаров
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *           format: float
 *         description: Минимальная цена товара (опционально)
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *           format: float
 *         description: Максимальная цена товара (опционально)
 *     responses:
 *       '200':
 *         description: Успешный запрос. Возвращает список товаров с указанной моделью и соответствующими ценами.
 *       '404':
 *         description: Товары не найдены.
 */
router.get('/models/:model', (req, res) => {
    const model = req.params.model.replace(/%20/g, ' ');

    const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice) : undefined;
    const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice) : undefined;

    // Фильтруем товары, где указанная модель присутствует в свойстве compatibleModels
    let filteredItems = items.filter(item =>
        item.compatibleModels.includes(model)
    );

    // фильтрацию по цене
    if (minPrice !== undefined) {
        filteredItems = filteredItems.filter(item => item.price >= minPrice);
    }
    if (maxPrice !== undefined) {
        filteredItems = filteredItems.filter(item => item.price <= maxPrice);
    }

    res.json(filteredItems);
});


export default router;