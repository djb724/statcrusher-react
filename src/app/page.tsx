'use client'

import Image from "next/image";
import styles from "./page.module.css";
import * as types from './types';
import { getUsageData, getPokemonData } from './api';
import PokemonList from "./pokemon-list";
import { useState } from "react";

type ButtonOption = {
  name: string,
  value: any
}

function SelectorButtonRow({ options, selected, onSelectedChange }: {
  options: ButtonOption[], selected: (string | number), onSelectedChange: Function
}) {
  let optionSelected = false;
  let buttons: any = options.map((opt: ButtonOption) => {
    let classes: string = styles.selector;
    if (selected === opt.value) {
      classes += ' ' + styles.selected;
      optionSelected = true;
    }
    return (
      <button
        className={classes} 
        onClick={() => onSelectedChange(opt.value)} 
        key = {opt.value}
      >{opt.name}</button>
    )
  })

  if (!optionSelected) 
    console.warn(`Selected option '${selected}' is not in the list`);

  return <div className={styles.selectorRow}>
    {buttons}
  </div>
}

function SelectorDropdown({options, selected, onSelectedChange}: {
  options: ButtonOption[], selected: string, onSelectedChange: Function
}) {
  let optionEls = options.map((option: ButtonOption) => {
    return <option value={option.value} key={option.value}>{option.name}</option>
  })

  return <select className={styles.selector}>
    {optionEls}
  </select>
}

function SelectorPanel({ params, onParamsChange, restrictedFilter, onRestrictedFilterChange }:
  { params: types.pathParams, onParamsChange: (params: types.pathParams) => void,
    restrictedFilter: types.RestrictedFilter, onRestrictedFilterChange: Function}
) {

  let elos: ButtonOption[] = [
    {name: 'All', value: 0},
    {name: '1500+', value: 1500},
    {name: '1630+', value: 1630},
    {name: '1760+', value: 1760}
  ]
  let formats: ButtonOption[] = [
    {name: 'Bo1', value: 'gen9vgc2024regg'},
    {name: 'Bo3', value: 'gen9vgc2024reggbo3'}
  ]
  let months: ButtonOption[] = [
    {name: '2024-06', value: '2024-06'},
    {name: '2024-05', value: '2024-05'},
    {name: '2024-04', value: '2024-04'},
  ]
  let filterOptions: ButtonOption[] = [
    {name: 'All', value: types.RestrictedFilter.all},
    {name: 'Restricted', value: types.RestrictedFilter.restricted},
    {name: 'Non-Restricted', value: types.RestrictedFilter.nonrestricted}
  ]

  return <div>
    <SelectorButtonRow
      options={elos}
      selected={params.elo}
      onSelectedChange={(elo: string | number) => onParamsChange({...params, elo: elo as number})} />
    <div className={styles.flexRow}>
      <SelectorButtonRow
        options={formats}
        selected={params.format}
        onSelectedChange={(format: string | number) => onParamsChange({...params, format: format as string})} />
      <SelectorDropdown
        options={months}
        selected={params.month}
        onSelectedChange={(month: string) => onParamsChange({...params, month: month})} />
    </div>
    <SelectorButtonRow
      options={filterOptions}
      selected={restrictedFilter}
      onSelectedChange={onRestrictedFilterChange} />
  </div>
}

function SidePanel({ params, onParamsChange, selectedPokemon, onSelectedPokemonChange }: {
  params: types.pathParams, onParamsChange: (params: types.pathParams) => void,
  selectedPokemon?: string, onSelectedPokemonChange: (selectedPokemon: string) => void
}) {
  let [usage, setUsage] = useState([]);
  let [restrictedFilter, setRestrictedFilter]: 
    [types.RestrictedFilter, Function] = useState(types.RestrictedFilter.all)

  return (
    <div>
      <SelectorPanel 
        params={params} 
        onParamsChange={onParamsChange}
        restrictedFilter={restrictedFilter}
        onRestrictedFilterChange={setRestrictedFilter} />
      <PokemonList data={usage} />
    </div>
  )
}

export default function Home() {

  let defaultParams: types.pathParams = {
    elo: 0,
    format: 'gen9vgc2024regg',
    month: '2024-04',
  }
  let [params, setParams]: [types.pathParams, (params: types.pathParams) => void] = useState(defaultParams);
  let [selectedPokemon, setSelectedPokemon]: [string, (pokemon: string) => void] = useState('');

  return (
    <div className={styles.main}>
      <div className={styles.header}>StatCrusher</div>
      <div className={styles.sideDisplayContainer}>
        <SidePanel params={params} onParamsChange={(params) => setParams({...params})}
          selectedPokemon={selectedPokemon} onSelectedPokemonChange={setSelectedPokemon} />
      </div>
    </div>
  );
}
