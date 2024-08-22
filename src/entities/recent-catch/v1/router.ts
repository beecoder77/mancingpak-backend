import express, { Request, Router } from 'express';

import {
    getRecentCatchByUserAddress,
} from './db';
import { wrapperError, wrapperSuccess } from '../../../wrapper';
import { getUser } from '../../users/db';

export function getRouter(): Router {
    const router = express.Router();

    router.get(
        '/v1',
        async (
            req: Request<any>,
            res
        ) => {
            // Get headers address
            const addressId:any = req.get('address');

            const user = await getUser(addressId);
            // authentication from addressid user
            if(!user) {
                return wrapperError(res, null, 'You are not authenticated', 401)
            }
            const collectionData:any = await getRecentCatchByUserAddress(addressId);
            return wrapperSuccess(res, collectionData, 'Successfully get recent catches');
        }
    );

    return router;
}
