import {RestrictedFilter, UsageData, Status} from './types';
import Image from 'next/image';
import styles from './pokemon-list.module.css'
import { percent, conc } from "./util";

function PokemonListItem({ data, selected, onSelect }: {
  data: UsageData, selected: boolean, onSelect: () => void
}): JSX.Element {

  let className = styles.pokemonListItem + ' ';
  className += selected ? styles.pokemonListItemSelected : '';

  return (<div  
      className={className}
      onClick={onSelect}>
    <div className={styles.rank}>{data.rank}</div>
    <Image 
      className={styles.menuSprite}
      src={`/menu-sprites/${data.name}.png`} 
      alt='' width={64} height={64} />
    <div className={styles.pokemonName}>{data.name}</div>
    <div className={styles.usageRate}>{percent(data.usageRate)}</div>
  </div>)
}

function AggregateListItem({ selected, onSelect }: {
  selected: boolean, onSelect: () => void
}): JSX.Element {

  return (<div
      className={conc(styles.aggregateListItem, selected ? 'selected' : '')}
      onClick={onSelect}>
    <div className={styles.pokemonName}>All Pokemon</div>
    <div className={styles.aggregateUsageRate}>100.00%</div>
  </div>)
}

export default function PokemonList({ data, status, restrictedFilter, searchFilter, selectedPokemon, onSelectedPokemonChange }: {
  data: UsageData[],
  status: Status,
  restrictedFilter: RestrictedFilter,
  searchFilter: string,
  selectedPokemon?: string,
  onSelectedPokemonChange: Function
}) {
  if (status === Status.inProgress) return <div>loading...</div>
  if (status === Status.error) return <div>error</div>

  if (restrictedFilter === RestrictedFilter.restricted) {
    data = data.filter(p => p.isRestricted);
  }
  else if (restrictedFilter === RestrictedFilter.nonrestricted) {
    data = data.filter(p => !p.isRestricted);
  }
  if (searchFilter) {
    data = data.filter(p => p.name.toLowerCase().includes(searchFilter.toLowerCase()))
  }
  let elementList = data.map(ud => {
    let s = selectedPokemon === ud.name;
    return <PokemonListItem key={`li${ud.name}`} data={ud} selected={s} onSelect={() => onSelectedPokemonChange(ud.name)} />
  });
  return <div>
    <AggregateListItem selected={selectedPokemon==='Metagame'} onSelect={() => onSelectedPokemonChange('Metagame')} />
    {elementList}
  </div>
}

