import axios from 'axios';
import { PathParams } from './types';
import {UsageData, PokemonData} from './types'

type ApiResponse = {
  status: number,
  statusText: string,
  data: any
}

// const url = 'https://api.statcrusher.com'
const url = 'https://b8wasaivpe.execute-api.us-east-2.amazonaws.com/beta';

export async function getPokemonData(params: PathParams, species: string): Promise<PokemonData[]> {

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
  .then((res: ApiResponse) => {return res.data as PokemonData[]})
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