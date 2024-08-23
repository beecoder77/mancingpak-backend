import express, { Request, Response, Router } from 'express';
import { v4 } from 'uuid';

import {
    countUsers,
    createUser,
    deleteUser,
    getUser,
    getUsers,
    updateUser
} from './db';

export function getRouter(): Router {
    const router = express.Router();

    router.get(
        '/listUser',
        async (
            req: Request<any, any, any, { limit?: string; offset?: string }>,
            res
        ) => {
            const limit = Number(req.query.limit ?? -1);
            const offset = Number(req.query.offset ?? 0);

            const users = await getUsers(limit, offset);

            if (!users) {
                return res.status(404).json(
                    {
                        err: true,
                        message: 'user not found!',
                        data: []
                    }
                )
            }

            res.json(
                {
                    err: false,
                    message: 'success get list user',
                    data: users
                }
            );
        }
    );

    router.get('/count', async (_req, res) => {
        res.json(await countUsers());
    });

    router.get('/detailUser', async (req: Request, res) => {
        const id = req.headers.authorization ?  req.headers.authorization.replace('Bearer ', '') : '';
        console.log(id);
        if (!id) {
            return res.status(500).json(
                {
                    err: true,
                    message: 'id authorizations not found!',
                    data: {}
                }
            )
        } 

        const user = await getUser(`${id}`);

        if (user) {
            res.json({
                err: false,
                message: `Success get detail user`,
                data: user
            });
        } else {
            res.status(404).json(
                {
                    err: true,
                    message: `user with address ${id} not found!`,
                    data: {
                        id: id
                    }
                }
            )
        }
    });

    router.post(
        '/register',
        async (
            req: Request<any, any, { 
                username: string; 
                address: string;
            }>,
            res
        ) => {
            const { username, address } = req.body;

            try {
                if (!username || !address) {
                    res.status(500).json(
                        {
                            err: true,
                            message: 'Username and address required!'
                        }
                    )
                }
                const user = await createUser({
                    username,
                    address,
                });
    
                res.json({
                    err: user.err,
                    message: user.message,
                    data: user.data
                });
            } catch (err) {
                console.log(err);
                res.status(500).json(
                    {
                        err: true,
                        message: err,
                        data: {}
                    }
                )
            }
            
        }
    );

    router.put('/', updateHandler);

    router.delete('/deleteUser', async (req: Request<any, any, { id: number }>, res) => {
        const id = req.headers.authorization;
        
        if (!id) {
            res.status(500).json(
                {
                    err: true,
                    message: 'Id required!'
                }
            )
        } else {
            const deletedId = await deleteUser(id);
    
            res.json(deletedId);
        }
    });

    router.post('/login', async (req: Request, res) => {
        const address = req.headers.authorization ?  req.headers.authorization.replace('Bearer ', '') : '';
        console.log(address);
        if (!address) {
            return res.status(500).json(
                {
                    err: true,
                    message: 'address authorizations not found!',
                    data: {}
                }
            )
        } 

        const user = await getUser(`${address}`);

        if (user) {
            res.json({
                err: false,
                message: `Success get detail user`,
                data: {
                    id: user.id,
                    address: user.address
                }
            });
        } else {
            res.status(404).json(
                {
                    err: true,
                    message: `user with address ${address} not found!`,
                    data: {
                        id: address
                    }
                }
            )
        }
    })

    return router;
}

async function updateHandler(
    req: Request<any, any, { id: string; username?: string; accessToken?: string; address?: string, level?: number, energy?: number }>,
    res: Response
): Promise<void> {
    const { id, username, address, accessToken, level, energy } = req.body;

    if (!id) {
        res.status(500).json(
            {
                err: true,
                message: 'Id required!'
            }
        )
    } else {
        const user = await updateUser({
            id,
            username: username ? username : '',
            address: address ? address : '',
            accessToken: accessToken ?  accessToken : '',
            level: level ? level : 0,
            energy: energy ? energy : 0,
        });
    
        res.json(user);
    }
    
}
