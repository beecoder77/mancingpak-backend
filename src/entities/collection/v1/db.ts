import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

// type Collection = {
//     title: string;
//     imgUrl: string;
//     height: number;
//     rarity: string;
//     price: number;
//     createdAt: Date;
//     updatedAt: Date;
// };

@Entity()
export class Collection extends BaseEntity {
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
    userAddress: string;

    @Column()
    createdAt: Date = new Date();

    @Column()
    updatedAt: Date = new Date();
}

export type PostCollection = Pick<Collection, 'title' | 'imgUrl' | 'height' | 'rarity' | 'price' | 'userAddress' | 'createdAt' | 'updatedAt'> & { fishId: Collection['id'] };

export async function getCollectionByUserAddress(address: string): Promise<Collection[]> {
    return await Collection.find({
        where: {
            userAddress: address
        }
    });
}

export async function pushToCollection(fish: any, addressId: any): Promise<any> {
    try {
        const fishData = new Collection;
        fishData.id = fish.id;
        fishData.title = fish.title;
        fishData.imgUrl = fish.imgUrl;
        fishData.height = fish.height;
        fishData.rarity = fish.rarity;
        fishData.price = fish.price;
        fishData.userAddress = addressId;
        fishData.createdAt = new Date();
        fishData.updatedAt = new Date();
        await Collection.save(fishData);
        return {
            err: false,
            message: 'Collection created successfully!',
            data: fishData
        }
    } catch (err) {
        return {
            err: true,
            message: err
        }
    }
    
}