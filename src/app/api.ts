import fetch from 'node-fetch';
import {usageData, pokemonData} from './types'

type ApiResponse = {
  status: number,
  response: any
}

const url = 'https://b8wasaivpe.execute-api.us-east-2.amazonaws.com/beta';

export async function getPokemonData(elo: number, species: string): Promise<pokemonData[]> {

  let path = `/${elo}/stats/${species}`;
  return fetch(url + path, {
    method: 'GET'
  })
  .then(res => res.json() as Promise<ApiResponse>)
  // .then(res => {console.log(res); return res})
  .then(res => {return res.response as pokemonData[]})
}

export async function getUsageData(elo: number): Promise<usageData[]> {

  let path = `/${elo}/usage`;
  return fetch(url + path, {
    method: 'GET'
  })
  .then(res => res.json() as Promise<ApiResponse>)
  // .then(res => {console.log(res); return res})
  .then(res => {return res.response as usageData[]})
}