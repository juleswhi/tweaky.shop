import sqlite3 from "sqlite";
import { open } from 'sqlite'

export function isValidPasscode(code: string): boolean {
    let isValid = false;

    open({
            filename: '../tweaksino/db.db',
            driver: sqlite3.Database
    }).then((db) => {
                const res = db.get('SELECT * from Bitch WHERE Password = ?', btoa(code));
                if (res != null) isValid = true;
    });
        return isValid;
    }
