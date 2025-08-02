import {useState, useEffect} from 'react'
import axios from 'axios';
import {UsageData, PokemonData, AggregateData} from './types'
import {Status, PathParams} from './types'

type ApiResponse = {
  status: number,
  statusText: string,
  data: any
}

// const url = 'https://api.statcrusher.com'
const url = process.env.NEXT_PUBLIC_API_URL

export type UseStatsResponse = [ Status, PokemonData, AggregateData ]
export function useStats(params: PathParams, species: string): UseStatsResponse {
  let [status, setStatus]: [Status, Function] = useState(Status.inProgress)
  let [pokemonData, setPokemonData]: [PokemonData | undefined, Function] = useState();
  let [aggregateData, setAggregateData]: [AggregateData | undefined, Function] = useState();

  useEffect(() => {
    if (!species) return;
    setStatus(Status.inProgress);
    getPokemonData(params, species)
      .then((data) => {
        if (species === 'Metagame') {
          setAggregateData(data);
          setStatus(Status.complete);
        }
        else {
          setPokemonData(data);
          setStatus(Status.complete);
        }
      })
      .catch((err) => {
        console.error(err);
        setStatus(Status.error);
      })
  }, [params.bestOf, params.elo, params.month, species])
  return [status, pokemonData, aggregateData]
}

export async function getPokemonData(params: PathParams, species: string): Promise<PokemonData> {

  let {elo, month, bestOf} = params;
  const [mon, format] = month.split(':');
  let path = `/stats/${mon}/${format}${bestOf}/${elo}/${species}`;
  return axios.get(url + path)
  .then((res) => {
    if (res.status !== 200) {
      return Promise.reject(res.statusText)
    }
    return res as ApiResponse;
  })
  .then((res: ApiResponse) => {
    return res.data as PokemonData
  })
}

export function useUsageData(params: PathParams): [Status, UsageData[]] {
  let [status, setStatus] = useState<Status>(Status.complete);
  let [usage, setUsage] = useState<UsageData[]>([])

  useEffect(() => {
    setStatus(Status.inProgress)
    getUsageData(params)
      .then(data => {
        setStatus(Status.complete)
        setUsage(data);
      })
      .catch(() => setStatus(Status.error));
  }, [params.bestOf, params.elo, params.month])

  return [status, usage]
}

export async function getUsageData(params: PathParams): Promise<UsageData[]> {

  let {elo, month, bestOf} = params;
  const [mon, format] = month.split(':');
  let path = `/usage/${mon}/${format}${bestOf}/${elo}`;
  return axios.get(url + path)
  .then((res) => {
    if (res.status !== 200) {
      return Promise.reject(res.statusText)
    }
    return res as ApiResponse;
  })
  .then(res => {return res.data as UsageData[]})
}
