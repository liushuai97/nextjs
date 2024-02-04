import common from "./zh/common.json";
import login from "./zh/login.json";
import home from "./zh/home.json";

interface resource {
  common: typeof common;
  login: typeof login;
  home: typeof home;
}
type ResourceKey = keyof resource;
export type LangKeys<T> = T extends ResourceKey ? keyof resource[T] : never;
export type ITran = (key: LangKeys<ResourceKey>) => string;
