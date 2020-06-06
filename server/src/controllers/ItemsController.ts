import { Request, Response } from 'express';
import knex from '../database/connection';
import BaseUrl from '../config/baseUrl';

const baseUrl = new BaseUrl();
const url = baseUrl.url(["/", "assets", "/"]);

class ItemsController {
    async index(request: Request, response: Response) {
        const items = await knex('items').select('*');

        const serializedItems = items.map(item => {
            return {
                id: item.id,
                title: item.title,
                image_url: `${url}${item.image}`
            };
        });

        return response.json(serializedItems);
    }
}

export default ItemsController;