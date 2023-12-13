import { pool } from "./db";
import { QueryResult } from "pg";


export async function databaseQuery(Query: string, array?:((string | undefined) [] )| string ): Promise<any>{
    const ans: QueryResult = await pool.query(Query, array);
    return ans;
}
