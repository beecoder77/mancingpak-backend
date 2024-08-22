import express, { Request, Router } from 'express';

import {
    getCollectionByUserAddress,
} from '../v1/db';
import { wrapperError, wrapperSuccess } from '../../../wrapper';
import { getUser } from '../../users/db';

export function getRouter(): Router {
    const router = express.Router();

    router.get(
        '/v1/recent',
        async (
            req: Request<any>,
            res
        ) => {
            // Get headers address
            const addressId:any = req.get('address');

            const user = await getUser(addressId);
            // authentication from addressid user
            console.log(user, 'ZEHAHAAHAH', addressId)
            if(!user) {
                return wrapperError(res, null, 'You are not authenticated', 401)
            }
            const collectionData:any = await getCollectionByUserAddress(addressId);
            return wrapperSuccess(res, collectionData, 'Successfully get recent catches');
        }
    );

    return router;
}
