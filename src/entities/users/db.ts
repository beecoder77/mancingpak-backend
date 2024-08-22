import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { isAddress } from 'ethers';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class User extends BaseEntity {
    @Column({ primary: true })
    id: string;

    @Column({ nullable: true })
    // @Column({ unique: true, nullable: true })
    username: string;

    @Column({ nullable: true })
    // @Column({ unique: true, nullable: true})
    address: string;

    @Column({nullable: true})
    accessToken: string;

    @Column()
    createdAt: Date = new Date();

    @Column()
    updatedAt: Date = new Date();
}

export type UserCreate = Pick<User, 'username' | 'address'>;
export type UserCreateGoogle = Pick<User, 'accessToken'>;
export type UserUpdate = Pick<User, 'id' | 'address' | 'username' | 'accessToken'>;

export async function getUsers(limit: number, offset: number): Promise<User[]> {
    return await User.find({
        take: limit,
        skip: offset
    });
}

export async function getUser(id: string): Promise<User | null> {
    return await User.findOne({
        where: {
            id: id
        }
    });
}

export async function countUsers(): Promise<number> {
    return await User.count();
}

export async function createUser(userCreate: UserCreate): Promise<{err: boolean, message: any, data?: User | Object}> {
    try {
        if (!userCreate.username || !userCreate.address) {
            return {
                err: true,
                message: 'createUser: Username and address required!'
            }
        }
        let user = new User();
        user.id = uuidv4();
        if (userCreate.username && userCreate.username !== 'catatmak') {
            const getUserByUsername = await User.findOne({
                where: {
                    username: userCreate.username
                }
            });
            if (getUserByUsername) {
                return {
                    err: true,
                    message: `createUser: ${userCreate.username} already exists!`
                }
            }
        
            const getUserByAddress = await User.findOne({
                where: {
                    address: userCreate.address
                }
            });
        
            if (getUserByAddress) {
                return {
                    err: true,
                    message: `createUser: ${userCreate.address} already exists!`,
                    data: {}
                }
            }
        }
        
        user.username = userCreate.username;
        user.address = userCreate.address ? userCreate.address : '';
        user.createdAt = new Date();
        user.updatedAt = new Date();

        if (userCreate.address) {
            const checkIsValidAddress = isAddress(userCreate.address);
            if (!checkIsValidAddress) {
                return {
                    err: true,
                    message: `Address is invalid!`,
                    data: {
                        address: userCreate.address
                    }
                }
            }
            user.address = userCreate.address;
        }

        const userSave = await user.save();
        return {
            err: false,
            message: 'User created successfully!',
            data: {
                id: userSave.id,
                username: userSave.username,
                address: userSave.address,
                createdAt: userSave.createdAt,
                updatedAt: userSave.updatedAt
            }
        }
    } catch (err) {
        return {
            err: true,
            message: err
        }
    }
    
}

export async function updateUser(userUpdate: UserUpdate): Promise<User> {
    const user = await getUser(userUpdate.id);
    if (user === null) {
        throw new Error(`updateUser: ${userUpdate.id} not found!`);
    }
    if (userUpdate.username && userUpdate.username !== 'catatmak') {
        const checkAddressIsUnique = await User.findOne({
            where: {
                id: userUpdate.id,
                address: userUpdate.address
            }
        });
        if (checkAddressIsUnique) {
            throw new Error(`updateUser: ${userUpdate.address} already exists!`);
        }
        const checkUsernameIsUnique = await User.findOne({
            where: {
                id: userUpdate.id,
                username: userUpdate.username
            }
        });
        if (checkUsernameIsUnique) {
            throw new Error(`updateUser: ${userUpdate.username} already exists!`);
        }
        if (userUpdate.address) {
            const checkIsValidAddress = isAddress(userUpdate.address);
            if (!checkIsValidAddress) {
                throw new Error(`updateUser: ${userUpdate.address} is invalid!`)
            }
            user.address = userUpdate.address;
        }
    }
    
    await User.update(userUpdate.id, {
        username: userUpdate.username ? userUpdate.username : user.username ? user.username : '',
        address: userUpdate.address ? userUpdate.address : user.address ? user.address : '',
        accessToken: userUpdate.accessToken ? userUpdate.accessToken : user.accessToken ? user.accessToken : '',
        createdAt: user.createdAt,
        updatedAt: new Date()
    })

    const updatedUser = await getUser(userUpdate.id);

    if (updatedUser === null) {
        throw new Error(`updateUser: failed for id ${userUpdate.id}`);
    }

    return updatedUser;
}

export async function deleteUser(id: string): Promise<string> {
    const deleteResult = await User.delete(id);

    if (deleteResult.affected === 0) {
        throw new Error(`deleteUser: could not delete user with id ${id}`);
    }

    return id;
}
