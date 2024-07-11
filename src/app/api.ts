import axios from 'axios';
import {usageData, pokemonData} from './types'

type ApiResponse = {
  status: number,
  response: any
}

const url = 'https://b8wasaivpe.execute-api.us-east-2.amazonaws.com/beta';

export async function getPokemonData(elo: number, species: string): Promise<pokemonData[]> {

  let path = `/${elo}/stats/${species}`;
  return axios.get(url + path)
  .then((res) => {
    if (res.status !== 200) {
      return Promise.reject(res.statusText)
    }
    return res.data as ApiResponse;
  })
  // .then(res => {console.log(res); return res})
  .then((res: ApiResponse) => {return res.response as pokemonData[]})
}

export async function getUsageData(elo: number): Promise<usageData[]> {

  let path = `/${elo}/usage`;
  return axios.get(url + path)
  .then((res) => {
    if (res.status !== 200) {
      return Promise.reject(res.statusText)
    }
    return res.data as ApiResponse;
  })
  // .then(res => {console.log(res); return res})
  .then(res => {return res.response as usageData[]})
}