/**
 * @swagger
 * tags:
 *   - name: Autos
 *     description: API для управления автомобилями
 */

import express from 'express';
import autos from '../data/autos.js';

const router = express.Router();

/**
 * @swagger
 * /api/auto:
 *   get:
 *     summary: Получить список автомобилей
 *     tags:
 *       - Autos
 *     responses:
 *       '200':
 *         description: Успешный запрос. Возвращает список автомобилей.
 *       '404':
 *         description: Автомобили не найдены.
 */
router.get('/', (req, res) => {
    res.json(autos);
});

/**
 * @swagger
 * /api/auto/{id}:
 *   get:
 *     summary: Получить информацию о автомобиле по ID
 *     tags:
 *       - Autos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID автомобиля
 *     responses:
 *       '200':
 *         description: Успешный запрос. Возвращает информацию о автомобиле.
 *       '404':
 *         description: Автомобиль не найден.
 */
router.get('/:id', (req, res) => {
    const auto = autos.find(a => a.id === parseInt(req.params.id));
    if (auto) {
        res.json(auto);
    } else {
        res.status(404).send('Auto not found');
    }
});

/**
 * @swagger
 * /api/auto:
 *   post:
 *     summary: Создать новый автомобиль
 *     tags:
 *       - Autos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               brand:
 *                 type: string
 *               year:
 *                 type: integer
 *               price:
 *                 type: number
 *               modelType:
 *                 type: string
 *             example:
 *               brand: BMW
 *               year: 2020
 *               price: 45000
 *               modelType: BMW X5
 *     responses:
 *       '201':
 *         description: Автомобиль успешно создан.
 */
router.post('/', (req, res) => {
    const newAuto = req.body;
    newAuto.id = autos.length ? autos[autos.length - 1].id + 1 : 1;
    autos.push(newAuto);
    res.status(201).json(newAuto);
});

/**
 * @swagger
 * /api/auto/{id}:
 *   put:
 *     summary: Обновить информацию о автомобиле по ID
 *     tags:
 *       - Autos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID автомобиля
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               brand:
 *                 type: string
 *               year:
 *                 type: integer
 *               price:
 *                 type: number
 *               modelType:
 *                 type: string
 *             example:
 *               brand: BMW X5
 *               year: 2022
 *               price: 60000
 *               modelType: SUV
 *     responses:
 *       '200':
 *         description: Информация о автомобиле успешно обновлена.
 *       '404':
 *         description: Автомобиль не найден.
 */
router.put('/:id', (req, res) => {
    const index = autos.findIndex(a => a.id === parseInt(req.params.id));
    if (index !== -1) {
        autos[index] = req.body;
        autos[index].id = parseInt(req.params.id);  // Ensure the ID remains unchanged
        res.json(autos[index]);
    } else {
        res.status(404).send('Auto not found');
    }
});

/**
 * @swagger
 * /api/auto/{id}:
 *   delete:
 *     summary: Удалить автомобиль по ID
 *     tags:
 *       - Autos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID автомобиля
 *     responses:
 *       '204':
 *         description: Автомобиль успешно удален.
 *       '404':
 *         description: Автомобиль не найден.
 */
router.delete('/:id', (req, res) => {
    const index = autos.findIndex(a => a.id === parseInt(req.params.id));
    if (index !== -1) {
        autos.splice(index, 1);
        res.status(204).send();
    } else {
        res.status(404).send('Auto not found');
    }
});

export default router;