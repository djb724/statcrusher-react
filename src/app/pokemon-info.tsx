import { PokemonData, Status } from "./types"



export function InfoDisplayContainer({pokemonData, status}: {
  pokemonData?: PokemonData,
  status: Status
}) {
  if (status === Status.inProgress) return <div>loading...</div>
  if (status === Status.error) return <div>An error occured</div>

  return <div>{pokemonData?.dexNum}</div>
}