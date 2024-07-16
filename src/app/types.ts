export enum RestrictedFilter {
  "all", 
  "restricted",
  "nonrestricted"
}

export type PathParams = {
  elo: number,
  format: string,
  month: string,
}

export type UsageData = {
  name: string,
  usageRate: number,
  rank: number,
  rawCount: number,
  isRestricted: boolean,
  num: number
}

export type ValueFrequency = {
  value: string,
  usage: number
}

export type StatsFrequencies = {
  frequency: ValueFrequency[],
  cumulativeFreq: ValueFrequency[],
  cumulativeDesc: ValueFrequency[]
}

export type PokemonData = {
  abilities: ValueFrequency[],
  natures: ValueFrequency[],
  teammates: ValueFrequency[],
  dexNum: number,
  stats: {
    hp: StatsFrequencies,
    atk: StatsFrequencies,
    def: StatsFrequencies,
    satk: StatsFrequencies,
    sdef: StatsFrequencies,
    spd: StatsFrequencies
  },
  moves: ValueFrequency[],
  type: string[],
  baseStats: {
    hp: number,
    atk: number,
    def: number,
    satk: number,
    sdef: number,
    spd: number
  },
  items: ValueFrequency[],
  key: string
}



export enum Status {
  "inProgress",
  "complete",
  "error"
}