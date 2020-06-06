import { Request, Response } from 'express';
import knex from '../database/connection';
import BaseUrl from '../config/baseUrl';

const baseUrl = new BaseUrl();
const url = baseUrl.url(["/", "uploads", "/"]);

class PointsController {

    async index(request: Request, response: Response) {
        const { city, uf, items } = request.query;

        const parsedItems = String(items)
            .split(',')
            .map(item => Number(item.trim()));

        const points = await knex('points')
            .select('id',
                'image',
                'name',
                'email',
                'whatsapp',
                'latitude',
                'longitude',
                'city',
                'uf',
                knex.raw(`'${url}' || "image" as 'image_url'`)
            )
            .join('point_items', 'points.id', '=', 'point_items.point_id')
            .whereIn('point_items.item_id', parsedItems)
            .where('city', String(city))
            .where('uf', String(uf))
            .groupBy('image',
                'name',
                'email',
                'whatsapp',
                'latitude',
                'longitude',
                'city',
                'uf'
            );

        return response.json(points);
    }

    async show(request: Request, response: Response) {
        const { id } = request.params;
        const point = await knex('points')
            .select(
                'id',
                'image',
                'name',
                'email',
                'whatsapp',
                'latitude',
                'longitude',
                'city',
                'uf',
                knex.raw(`'${url}' || "image" as 'image_url'`)
            )
            .where('points.id', id).first();

        if (!point) {
            return response.status(400).json({ message: 'Point not found.' });
        }

        const items = await knex('items')
            .join('point_items', 'items.id', '=', 'point_items.item_id')
            .where('point_items.point_id', id)
            .select('items.title');

        return response.json({ point, items });
    }

    async create(request: Request, response: Response) {
        const {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items
        } = request.body;

        const trx = await knex.transaction();

        const point = {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            image: request.file.filename
        };

        const insertedIds = await trx('points').insert(point);

        const point_id = insertedIds[0];

        const pointItems = items
            .split(',')
            .map((item: string) => Number(item.trim()))
            .map((item_id: number) => {
                return {
                    item_id,
                    point_id
                };
            });

        await trx('point_items').insert(pointItems);

        trx.commit();

        return response.json({ id: point_id, ...point, pointItems });
    }
}

export default PointsController;