import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Collection extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    collectionName: string;

    @Column()
    userAddress: string;

    @Column()
    data: string;

    @Column()
    createdAt: Date = new Date();

    @Column()
    updatedAt: Date = new Date();
}

export type PostCollection = Pick<Collection, 'collectionName' | 'userAddress' | 'data' | 'createdAt' | 'updatedAt'> & { collectionId: Collection['id'] };

export async function getCollectionByUserAddress(address: string): Promise<Collection[]> {
    return await Collection.find({
        where: {
            userAddress: address
        }
    });
}

export async function pushToCollection(data: any, addressId: any): Promise<any> {
    try {
        const collectionData = new Collection;
        collectionData.collectionName = data.collectionName;
        collectionData.userAddress = addressId;
        collectionData.data = data.data;
        await Collection.save(collectionData);
        return {
            err: false,
            message: 'Collection created successfully!',
            data: collectionData
        }
    } catch (err) {
        return {
            err: true,
            message: err
        }
    }
    
}
