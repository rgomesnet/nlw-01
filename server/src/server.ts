import express from 'express';
import cors from 'cors';
import path from 'path';
import routes from './routes';
import { errors } from 'celebrate';
import BaseUrl from './config/baseUrl';


const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

app.use('/assets', express.static(path.resolve(__dirname, 'assets')));
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

app.use(errors());

const baseUrl = new BaseUrl();

app.listen(baseUrl.port());

