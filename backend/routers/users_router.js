import { Router } from 'express';

import { getMongoSession } from '../datasource.js';

const db = await getMongoSession();

export const usersRouter = Router();

// TODO: add users routes