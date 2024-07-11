export enum RestrictedFilter {
  "all", 
  "restricted",
  "nonrestricted"
}

export type pathParams = {
  elo: number,
  format: string,
  month: string,
}

export type usageData = {
  name: string,
  usageRate: number,
  rank: number,
  rawCount: number
}

export type pokemonData = {
  name: string,
}