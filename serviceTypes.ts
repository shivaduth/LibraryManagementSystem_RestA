import { Request } from "express"
import { type } from "os"


export interface IGetUserAuthInfoRequest extends Request {
  user: User; 
}


export type User = {
    id?: string,
    role?: string,
    name?: string,
    email?: string,
    username?: string,
    accessToken?: string
}
export type Book = {
  id?: string,
  name: string,
  available_count?: number,
  issued_count?: number;
  
  
}
export interface Users{
  status: number,
  message?: string,
  user?: User,
  users?: User[]
}
type Message = {
  messagge: string
}
export interface Books{
  status: number,
  message?: string,
  book?: Book,
  books?: Book[]
}
export interface jwtUser extends Request{
  id:string,
  email:string,
  role:string,
  iat:number,
  exp:number
}