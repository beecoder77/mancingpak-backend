import express from 'express';

import { getRouter as getRouterUsers } from '../entities/users/router';
import { getRouter as getRouterFishing } from '../entities/fishing/v1/router';
import { getRouter as getRouterRecent } from '../entities/recent-catch/v1/router';
import { getRouter as getRouterCollection } from '../entities/collection/v1/router';

// TODO make this function's return type explicit https://github.com/demergent-labs/azle/issues/1860
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function initServer() {
    let app = express();

    app.use(express.json());

    app.use('/fishing', getRouterFishing())
    app.use('/collection', getRouterCollection())
    app.use('/recent', getRouterRecent())
    app.use('/auth/v1', getRouterUsers());

    return app.listen();
}
