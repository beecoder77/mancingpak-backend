import express, { Request, Router } from 'express';

import {
    getFishing,
    getRandomFish
} from '../v1/db';
import { wrapperSuccess } from '../../../wrapper';

export function getRouter(): Router {
    const router = express.Router();

    router.post(
        '/v1',
        async (
            req: Request<any>,
            res
        ) => {
            // Fish data from database
            const fishData:any = await getFishing();
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
            }
            const { dropRate, ...fishWithoutDropRate } = remappedFish;
            return wrapperSuccess(res, fishWithoutDropRate, 'Successfully catches fish');
        }
    );

    return router;
}
