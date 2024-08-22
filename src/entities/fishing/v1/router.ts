import express, { Request, Router } from 'express';

import {
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
            const fishData = [
                {
                    "title": "Bawal Monster",
                    "imgUrl": "https://storage.googleapis.com/mancingpak/nft/bawal_monster_mytical.png",
                    "attributes": {
                        "height": 100,
                        "rarity": "MYTICAL",
                        "price": 1000
                    },
                    "dropRate": 3
                },
                {
                    "title": "Dragon Fish",
                    "imgUrl": "https://storage.googleapis.com/mancingpak/nft/dragon_fish_legend.png",
                    "attributes": {
                        "height": 200,
                        "rarity": "LEGEND",
                        "price": 300
                    },
                    "dropRate": 5
                },
                {
                    "title": "Tuna Blue Fish",
                    "imgUrl": "https://storage.googleapis.com/mancingpak/nft/tuna_blue_epic.png",
                    "attributes": {
                        "height": 500,
                        "rarity": "EPIC",
                        "price": 150
                    },
                    "dropRate": 7
                },
                {
                    "title": "Java Barb",
                    "imgUrl": "https://storage.googleapis.com/mancingpak/nft/java_barb_rare.png",
                    "attributes": {
                        "height": 22,
                        "rarity": "RARE",
                        "price": 100
                    },
                    "dropRate": 11
                },
                {
                    "title": "Salmon",
                    "imgUrl": "https://storage.googleapis.com/mancingpak/nft/salmon_uncommon.png",
                    "attributes": {
                        "height": 24,
                        "rarity": "UNCOMMON",
                        "price": 20
                    },
                    "dropRate": 15
                },
                {
                    "title": "Gold Fish Mini",
                    "imgUrl": "https://storage.googleapis.com/mancingpak/nft/gold_fish_mini_common.png",
                    "attributes": {
                        "height": 15,
                        "rarity": "COMMON",
                        "price": 5
                    },
                    "dropRate": 20
                },
                {
                    "title": "Java Barb Mini",
                    "imgUrl": "https://storage.googleapis.com/mancingpak/nft/java_barb_mini_common.png",
                    "attributes": {
                        "height": 12,
                        "rarity": "COMMON",
                        "price": 5
                    },
                    "dropRate": 25
                }
            ];
            const caughtFish = await getRandomFish(fishData);
            const { dropRate, ...fishWithoutDropRate } = caughtFish;
            return wrapperSuccess(res, fishWithoutDropRate, 'Successfully catches fish');
        }
    );

    return router;
}
