export const migration0 = `
    CREATE TABLE users
    (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        address TEXT NOT NULL
    );

    CREATE TABLE fishing
    (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        imgUrl TEXT NOT NULL,
        height INTEGER NOT NULL,
        rarity TEXT NOT NULL,
        price INTEGER NOT NULL,
        dropRate INTEGER NOT NULL
    );
`;
