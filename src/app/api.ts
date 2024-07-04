import fetch from 'node-fetch';

const url = 'https://b8wasaivpe.execute-api.us-east-2.amazonaws.com/beta';

export async function pokemonData(elo: number, species: string) {

  let path = `/${elo}/stats/${species}`;
  return fetch(url + path, {
    method: 'GET'
  }).then(res => res.json())
}

export async function usageData(elo: number) {

  let path = `/${elo}/usage`;
  return fetch(url + path, {
    method: 'GET'
  }).then(res => res.json())
}