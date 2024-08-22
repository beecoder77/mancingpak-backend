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

// export type PostFishing = Pick<Fishing, 'title' | 'imgUrl' | 'height' | 'rarity' | 'price' | 'dropRate'> & { fishId: Fishing['id'] };

export async function getFishing(): Promise<Fishing[]> {
    return await Fishing.find({});
}

// export async function createPost(postCreate: PostCreate): Promise<Fishing> {
//     let post = new Fishing();

//     post.title = postCreate.title;
//     post.imgUrl = postCreate.imgUrl;
//     post.height = postCreate.height;
//     post.rarity = postCreate.rarity;
//     post.price = postCreate.price;
//     post.dropRate = postCreate.dropRate;

//     const user = await getUser(postCreate.user_id);

//     if (user === null) {
//         throw new Error(``);
//     }

//     post.user = user;

//     return await post.save();
// }

export async function getRandomFish(fishData: Fish[]): Promise<Fish> {
    try {
        // const caughtFish3 = await getFishing();
        const totalDropRate = fishData.reduce((sum, fish) => sum + fish.dropRate, 0);
        const randomValue = Math.random() * totalDropRate;

        let cumulativeDropRate = 0;
        for (const fish of fishData) {
            cumulativeDropRate += fish.dropRate;
            if (randomValue < cumulativeDropRate) {
                return fish;
            }
        }

        return fishData[fishData.length - 1];
    } catch (err: any) {
        console.error(err.stack);
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
