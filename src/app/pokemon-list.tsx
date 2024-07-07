import {usageData} from './types';
import Image from 'next/image';
import style from './page.module.css'

function percent(n: number): string {
  return (n * 100).toFixed(2) + '%';
}

function PokemonListItem(data: usageData) {

  return (<div className={style.pokemonListItem}>
    <div className={style.rank}>{data.rank}</div>
    <Image 
      className={style.menuSprite}
      src={'/menu-sprites/0025.png'} 
      alt='pkmn' width={64} height={64} />
    <div className={style.pokemonName}>{data.name}</div>
    <div className={style.usageRate}>{percent(data.usageRate)}</div>
  </div>)
}

export default function PokemonList({data}: 
    {data: usageData[]}) {
  
  let elementList = data.map(ud => PokemonListItem(ud));
  return <div>{elementList}</div>
}

