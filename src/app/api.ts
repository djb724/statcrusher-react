import {useState, useEffect} from 'react'
import axios from 'axios';
import {UsageData, PokemonData, AggregateData} from './types'
import {Status, PathParams} from './types'
import { dataCache } from './cache';

type ApiResponse = {
  status: number,
  statusText: string,
  data: any
}

// const url = 'https://api.statcrusher.com'
const url = process.env.NEXT_PUBLIC_API_URL

export type UseStatsResponse = [ Status, PokemonData | undefined, AggregateData | undefined ]

export function useStats(params: PathParams, species: string): UseStatsResponse {
  let [status, setStatus]: [Status, Function] = useState(Status.inProgress)
  let [pokemonData, setPokemonData]: [PokemonData | undefined, Function] = useState();
  let [aggregateData, setAggregateData]: [AggregateData | undefined, Function] = useState();

  useEffect(() => {
    if (!species) return;
    
    // Reset state when species changes to ensure re-render
    setStatus(Status.inProgress);
    if (species === 'Metagame') {
      setPokemonData(undefined);
    } else {
      setAggregateData(undefined);
    }
    
    // Check cache first
    const cached = dataCache.get(params, species);
    if (cached && cached.status === Status.complete) {
      if (species === 'Metagame') {
        setAggregateData(cached.data as AggregateData);
      } else {
        setPokemonData(cached.data as PokemonData);
      }
      setStatus(Status.complete);
      return;
    }

    // Check if there's a pending request
    const pending = dataCache.getPending(params, species);
    if (pending) {
      pending
        .then((data) => {
          if (species === 'Metagame') {
            setAggregateData(data as AggregateData);
          } else {
            setPokemonData(data as PokemonData);
          }
          setStatus(Status.complete);
        })
        .catch(() => {
          setStatus(Status.error);
        });
      return;
    }

    // Fetch new data
    getPokemonData(params, species)
      .then((data) => {
        dataCache.set(params, species, data, Status.complete);
        if (species === 'Metagame') {
          setAggregateData(data as AggregateData);
          setStatus(Status.complete);
        }
        else {
          setPokemonData(data as PokemonData);
          setStatus(Status.complete);
        }
      })
      .catch((err) => {
        console.error(err);
        dataCache.set(params, species, {} as PokemonData, Status.error);
        setStatus(Status.error);
      })
  }, [params.bestOf, params.elo, params.month, params.format, species])
  return [status, pokemonData, aggregateData]
}

export async function getPokemonData(params: PathParams, species: string): Promise<PokemonData | AggregateData> {

  let {elo, month, format, bestOf} = params;
  let path = `/stats/${month}/${format}${bestOf}/${elo}/${species}`;
  return axios.get(url + path)
  .then((res) => {
    if (res.status !== 200) {
      return Promise.reject(res.statusText)
    }
    return res as ApiResponse;
  })
  .then((res: ApiResponse) => {
    return res.data as PokemonData | AggregateData
  })
}

/**
 * Prefetch Pokemon data on mouseover. Returns immediately if data is already cached or being fetched.
 */
export function prefetchPokemonData(params: PathParams, species: string): void {
  if (!species) return;
  
  // Check if already cached
  if (dataCache.has(params, species)) {
    return;
  }
  
  // Check if already being fetched
  if (dataCache.getPending(params, species)) {
    return;
  }
  
  // Start fetching and cache the promise
  const promise = getPokemonData(params, species);
  dataCache.setPending(params, species, promise);
}

/**
 * Prefetch usage data on mouseover. Returns immediately if data is already cached or being fetched.
 */
export function prefetchUsageData(params: PathParams): void {
  // Check if already cached
  if (dataCache.hasUsage(params)) {
    return;
  }
  
  // Check if already being fetched
  if (dataCache.getPendingUsage(params)) {
    return;
  }
  
  // Start fetching and cache the promise
  const promise = getUsageData(params);
  dataCache.setPendingUsage(params, promise);
}

export function useUsageData(params: PathParams): [Status, UsageData[]] {
  let [status, setStatus] = useState<Status>(Status.complete);
  let [usage, setUsage] = useState<UsageData[]>([])

  useEffect(() => {
    // Check cache first
    const cached = dataCache.getUsage(params);
    if (cached && cached.status === Status.complete) {
      setUsage(cached.data);
      setStatus(Status.complete);
      return;
    }

    // Check if there's a pending request
    const pending = dataCache.getPendingUsage(params);
    if (pending) {
      setStatus(Status.inProgress);
      pending
        .then(data => {
          setStatus(Status.complete);
          setUsage(data);
        })
        .catch(() => setStatus(Status.error));
      return;
    }

    // Fetch new data
    setStatus(Status.inProgress)
    getUsageData(params)
      .then(data => {
        dataCache.setUsage(params, data, Status.complete);
        setStatus(Status.complete)
        setUsage(data);
      })
      .catch(() => {
        dataCache.setUsage(params, [], Status.error);
        setStatus(Status.error);
      });
  }, [params.bestOf, params.elo, params.month, params.format])

  return [status, usage]
}

export async function getUsageData(params: PathParams): Promise<UsageData[]> {

  let {elo, month, format, bestOf} = params;
  let path = `/usage/${month}/${format}${bestOf}/${elo}`;
  console.log(url + path);
  return axios.get(url + path)
  .then((res) => {
    if (res.status !== 200) {
      return Promise.reject(res.statusText)
    }
    return res as ApiResponse;
  })
  .then(res => {return res.data as UsageData[]})
}
