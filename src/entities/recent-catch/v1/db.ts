import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, In } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class RecentCatch extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    recentId: string;

    @Column()
    fishId: number;

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
    addedToCollection: boolean;

    @Column()
    createdAt: Date = new Date();

    @Column()
    updatedAt: Date = new Date();
}

export type PostRecentCatch = Pick<RecentCatch, 'recentId' | 'fishId' | 'title' | 'imgUrl' | 'height' | 'rarity' | 'price' | 'userAddress' | 'createdAt' | 'updatedAt'> & { ids: RecentCatch['id'] };
export type RecentCatchUpdate = Pick<RecentCatch, 'recentId' | 'addedToCollection' | 'updatedAt'>;

export async function getRecentCatchByUserAddress(address: string): Promise<RecentCatch[]> {
    return await RecentCatch.find({
        where: {
            userAddress: address
        }
    });
}

async function getRecentCatchByRecentId(recentIds: any): Promise<RecentCatch[]> {
    return await RecentCatch.find({
        where: {
            recentId: In(recentIds)
        }
    });
}

export async function pushToRecentCatch(fish: any, addressId: any): Promise<any> {
    try {
        const fishData = new RecentCatch;
        fishData.recentId = uuidv4();
        fishData.fishId = fish.id;
        fishData.title = fish.title;
        fishData.imgUrl = fish.imgUrl;
        fishData.height = fish.height;
        fishData.rarity = fish.rarity;
        fishData.price = fish.price;
        fishData.userAddress = addressId;
        fishData.addedToCollection = false;
        fishData.createdAt = new Date();
        fishData.updatedAt = new Date();
        await RecentCatch.save(fishData);
        return {
            err: false,
            message: 'RecentCatch created successfully!',
            data: fishData
        }
    } catch (err) {
        return {
            err: true,
            message: err
        }
    }
    
}

export async function updateAddedToCollectionToTrue(recentIds:any): Promise<RecentCatch> {
    const recentCatch = await getRecentCatchByRecentId(recentIds);
    if (recentCatch === null) {
        throw new Error(`recentCatch: ${recentIds} not found!`);
    }
    
    await RecentCatch.update({ recentId: In(recentIds) }, {
        addedToCollection: true,
        updatedAt: new Date()
    })

    const updatedResult:any = await getRecentCatchByRecentId(recentIds);
    if (updatedResult === null) {
        throw new Error(`updateUser: failed for recentId ${recentIds}`);
    }

    return updatedResult;
}