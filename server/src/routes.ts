import express, { request, response } from 'express';
import { celebrate, Joi } from 'celebrate';

import multer from 'multer';
import multerConfig from './config/multerConfig';

import ItemsController from './controllers/ItemsController';
import PointsController from './controllers/PointsController';

const routes = express.Router();

const itemsController = new ItemsController();
routes.get('/items', itemsController.index);

const pointsController = new PointsController();
const upload = multer(multerConfig);
routes.get('/points', pointsController.index);
routes.get('/points/:id', pointsController.show);
routes.post('/points',
    upload.single('image'),
    celebrate(
        {
            body: Joi.object().keys({
                name: Joi.string().required(),
                email: Joi.string().email().required(),
                whatsapp: Joi.number().required(),
                latitude: Joi.number().required(),
                longitude: Joi.number().required(),
                city: Joi.string().required(),
                uf: Joi.string().required().max(2),
                items: Joi.string().required()
            }
            )
        }, {
        abortEarly: false
    }),
    pointsController.create);

export default routes;