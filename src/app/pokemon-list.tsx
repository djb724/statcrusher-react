import {RestrictedFilter, UsageData, Status} from './types';
import Image from 'next/image';
import style from './page.module.css'

function percent(n: number): string {
  return (n * 100).toFixed(2) + '%';
}

function PokemonListItem({ data, selected, onSelect }: {
  data: UsageData, selected: boolean, onSelect: () => void
}): JSX.Element {

  let className = style.pokemonListItem + ' ';
  className += selected ? style.pokemonListItemSelected : '';

  return (<div  
      className={className}
      onClick={onSelect}>
    <div className={style.rank}>{data.rank}</div>
    <Image 
      className={style.menuSprite}
      src={'/menu-sprites/0025.png'} 
      alt='pkmn' width={64} height={64} />
    <div className={style.pokemonName}>{data.name}</div>
    <div className={style.usageRate}>{percent(data.usageRate)}</div>
  </div>)
}

export default function PokemonList({ data, status, restrictedFilter, selectedPokemon, onSelectedPokemonChange }: {
  data: UsageData[],
  status: Status,
  restrictedFilter: RestrictedFilter
  selectedPokemon?: string,
  onSelectedPokemonChange: Function
}) {
  if (status === Status.inProgress) return <div>loading...</div>
  if (status === Status.error) return <div>error</div>
  console.log(selectedPokemon);

  if (restrictedFilter === RestrictedFilter.restricted) {
    data = data.filter(p => p.isRestricted);
  }
  else if (restrictedFilter === RestrictedFilter.nonrestricted) {
    data = data.filter(p => !p.isRestricted);
  }
  let elementList = data.map(ud => {
    let s = selectedPokemon === ud.name;
    return <PokemonListItem key={`li${ud.name}`} data={ud} selected={s} onSelect={() => onSelectedPokemonChange(ud.name)} />
  });
  return <div>
    {elementList}
  </div>
}

