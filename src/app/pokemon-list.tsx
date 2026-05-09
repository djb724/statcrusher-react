import {RestrictedFilter, UsageData, Status, PathParams} from './types';
import Image from 'next/image';
import styles from './pokemon-list.module.css'
import { percent, conc } from "./util";
import { Loading } from './components';
import { prefetchPokemonData } from './api';

function PokemonListItem({ data, selected, onSelect, params, onMouseEnter }: {
  data: UsageData, 
  selected: boolean, 
  onSelect: () => void,
  params: PathParams,
  onMouseEnter?: () => void
}): JSX.Element {

  let className = styles.pokemonListItem + ' ';
  className += selected ? styles.pokemonListItemSelected : '';

  const handleMouseEnter = () => {
    prefetchPokemonData(params, data.name);
    onMouseEnter?.();
  };

  return (<div  
      className={className}
      onClick={onSelect}
      onMouseEnter={handleMouseEnter}>
    <div className={styles.rank}>{data.rank}</div>
    <Image 
      className={styles.menuSprite}
      src={`https://cdn.statcrusher.com/menu-sprites/${data.name}.png`} 
      alt='' width={64} height={64} />
    <div className={styles.pokemonName}>{data.name}</div>
    <div className={styles.usageRate}>{percent(data.usageRate)}</div>
  </div>)
}

function AggregateListItem({ selected, onSelect, params, onMouseEnter }: {
  selected: boolean, 
  onSelect: () => void,
  params: PathParams,
  onMouseEnter?: () => void
}): JSX.Element {

  const handleMouseEnter = () => {
    prefetchPokemonData(params, 'Metagame');
    onMouseEnter?.();
  };

  return (<div
      className={conc(styles.aggregateListItem, selected ? 'selected' : '')}
      onClick={onSelect}
      onMouseEnter={handleMouseEnter}>
    <div className={styles.pokemonName}>All Pokemon</div>
    <div className={styles.aggregateUsageRate}>100.00%</div>
  </div>)
}

export default function PokemonList({ data, status, restrictedFilter, searchFilter, selectedPokemon, onSelectedPokemonChange, params }: {
  data: UsageData[],
  status: Status,
  restrictedFilter: RestrictedFilter
  searchFilter: string,
  selectedPokemon?: string,
  onSelectedPokemonChange: Function,
  params: PathParams
}) {
  if (status === Status.inProgress) return <Loading />
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
    return <PokemonListItem 
      key={`li${ud.name}`} 
      data={ud} 
      selected={s} 
      onSelect={() => onSelectedPokemonChange(ud.name)}
      params={params} />
  });
  return <div>
    <AggregateListItem 
      selected={selectedPokemon==='Metagame'} 
      onSelect={() => onSelectedPokemonChange('Metagame')}
      params={params} />
    {elementList}
  </div>
}

