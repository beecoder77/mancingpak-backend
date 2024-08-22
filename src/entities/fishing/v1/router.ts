import express, { Request, Router } from 'express';
import {
    getFishing,
    getRandomFish
} from '../v1/db';
import { wrapperError, wrapperSuccess } from '../../../wrapper';
import { getUser } from '../../users/db';

export function getRouter(): Router {
    const router = express.Router();

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

            // Fish data from database
            const fishData: any = await getFishing();

            // Optionally, you can pass the header value to your getRandomFish function if needed
            const caughtFish = await getRandomFish(fishData);

            const remappedFish = {
                title: caughtFish?.title,
                imgUrl: caughtFish?.imgUrl,
                attributes: {
                    height: caughtFish?.height,
                    rarity: caughtFish?.rarity,
                    price: caughtFish?.price,
                },
                dropRate: 25
            };

            const { dropRate, ...fishWithoutDropRate } = remappedFish;
            return wrapperSuccess(res, fishWithoutDropRate, 'Successfully catches fish');
        }
    );

    return router;
}
