import express, { Request, Router } from 'express';

import {
    getCollectionByUserAddress,
    pushToCollection,
} from '../v1/db';
import { wrapperError, wrapperSuccess } from '../../../wrapper';
import { getUser } from '../../users/db';
import { updateAddedToCollectionToTrue } from '../../recent-catch/v1/db';

export function getRouter(): Router {
    const router = express.Router();

    router.get(
        '/v1/my',
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
            const collectionData:any = await getCollectionByUserAddress(addressId);
            return wrapperSuccess(res, collectionData, 'Successfully get recent catches');
        }
    );

    router.post(
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

            const collectionName = req?.body?.collectionName;
            const dataPushed = req?.body?.data;

            // Save to collection
            const collection = await pushToCollection({
                collectionName,
                data: JSON.stringify(dataPushed)
            }, addressId)
            if(collection?.err) {
                return wrapperError(res, null, 'Failed to insert collection', 400)
            }

            // set flagging data 'addedToCollection' to true on recent-catch table
            const recentIds = dataPushed.map((val:any) => val.recentId)
            const resultUpdateFlagRecent = await updateAddedToCollectionToTrue(recentIds);
            console.log(resultUpdateFlagRecent, 'ZEHAHAHAHAHAAH')
            if(!resultUpdateFlagRecent) {
                return wrapperError(res, null, 'Failed to update recent catch', 400);
            }

            const collectionData:any = await getCollectionByUserAddress(addressId);
            const response = (collectionData || []).map((val: any) => {
                return {
                    ...val,
                    data: JSON.parse(val.data)
                }
            })
            return wrapperSuccess(res, response, 'Successfully get recent catches');
        }
    );

    return router;
}
