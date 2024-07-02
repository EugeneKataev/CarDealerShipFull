import swaggerJSDoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Автосалон API',
            version: '1.0.0',
            description: 'API для работы с товарами, клиентами, автомобилями и заказами в автосалоне',
        },
    },
    apis: ['./routes/*.js'], // путь к файлам с маршрутами вашего API
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;