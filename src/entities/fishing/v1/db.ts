import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

type Fish = {
    title: string;
    imgUrl: string;
    attributes: {
        height: number;
        rarity: string;
        price: number;
    };
    dropRate: number;
};

@Entity()
export class Fishing extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    imgUrl: string;

    @Column()   
    height: number;

    @Column()
    rarity: string;

    @Column()   
    price: number;

    @Column()   
    dropRate: number;
}

export type PostFishing = Pick<Fishing, 'title' | 'imgUrl' | 'height' | 'rarity' | 'price' | 'dropRate'> & { fishId: Fishing['id'] };

export async function getFishing(): Promise<Fishing[]> {
    let fish = await Fishing.find();
    console.log(fish);
    if (!fish || !fish.length) {
        await createFish();
        fish = await Fishing.find();
    }
    return fish;
}

export async function createFishing(fishingCreate: PostFishing): Promise<Fishing> {
    let post = new Fishing();

    post.title = fishingCreate.title;
    post.imgUrl = fishingCreate.imgUrl;
    post.height = fishingCreate.height;
    post.rarity = fishingCreate.rarity;
    post.price = fishingCreate.price;
    post.dropRate = fishingCreate.dropRate;

    // const user = await getFishing();

    // if (user === null) {
    //     throw new Error(``);
    // }

    // post.user = user;

    return await post.save();
}

export async function getRandomFish(fishData: Fish[]): Promise<Fish> {
    try {
        // const caughtFish3 = await getFishing();
        // console.log(caughtFish3, 'AHAHAHAHAHAH')
        const totalDropRate = fishData.reduce((sum, fish) => sum + fish.dropRate, 0);
        const mathRandom = Math.random();
        const randomValue = mathRandom * totalDropRate;

        let cumulativeDropRate = 0;
        for (const fish of fishData) {
            cumulativeDropRate += fish.dropRate;
            if (randomValue < cumulativeDropRate) {
                return fish;
            }
        }

        return fishData[fishData.length - 1];
    } catch (err: any) {
        return {
            title: '',
            imgUrl: '',
            attributes: {
                height: 0,
                rarity: '',
                price: 0,
            },
            dropRate: 0,
        }
    }
}

export async function createFish(): Promise<any> {
    try {
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
        for (const datas of fishData) {
            const fishData = new Fishing;
            fishData.title = datas.title;
            fishData.imgUrl = datas.imgUrl;
            fishData.dropRate = datas.dropRate;
            fishData.height = datas.attributes.height;
            fishData.rarity = datas.attributes.rarity;
            fishData.price = datas.attributes.price
            await Fishing.save(fishData);
        }
        const saveData = await Fishing.save(fishData);
        console.log(saveData);
        return {
            err: false,
            message: 'User created successfully!',
            data: fishData
        }
    } catch (err) {
        return {
            err: true,
            message: err
        }
    }
    
}