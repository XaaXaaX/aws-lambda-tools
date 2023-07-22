export type Primitive = string|number|boolean;
export interface Json {
	[x: string]: Primitive | Date | Json | JsonArray;
}

export interface JsonArray extends Array<Primitive | Date | Json | JsonArray> { }

export type CatchedException = any | unknown;  

export type Nullable<TOrigin> = TOrigin | null | undefined;
