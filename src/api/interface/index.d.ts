export * from "./apiTypes/User";
export * from "./apiTypes/BaseResponseBoolean";
export * from "./apiTypes/UserRegisterRequest";
export * from "./apiTypes/BaseResponseLong";
export * from "./apiTypes/UserLoginRequest";
export * from "./apiTypes/BaseResponseUser";
export * from "./apiTypes/TeamDto";
export * from "./apiTypes/CreateTeamRequest";
export * from "./apiTypes/BaseResponseListUser";
export * from "./apiTypes/BaseResponseListTeamDto";
export type Primitive = undefined | null | boolean | string | number | symbol;
export type DeepRequired<T> = T extends Primitive ? T : keyof T extends never ? T : {
    [K in keyof T]-?: DeepRequired<T[K]>;
};
