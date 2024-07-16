'use client'

import Image from "next/image";
import styles from "./page.module.css";
import * as types from './types';
import { getUsageData, getPokemonData } from './api';
import PokemonList from "./pokemon-list";
import { useState, useEffect } from "react";
import { InfoDisplayContainer } from "./pokemon-info";

type ButtonOption = {
  name: string,
  value: any
}
const elos: ButtonOption[] = [
  { name: 'Any Elo', value: 0 },
  { name: '1500+', value: 1500 },
  { name: '1630+', value: 1630 },
  { name: '1760+', value: 1760 }
]
const formats: ButtonOption[] = [
  { name: 'Bo1', value: 'gen9vgc2024regg' },
  { name: 'Bo3', value: 'gen9vgc2024reggbo3' }
]
const months: ButtonOption[] = [
  // {name: '2024-06', value: '2024-06'},
  { name: '2024-05', value: '2024-05' },
  { name: '2024-04', value: '2024-04' },
]
const filterOptions: ButtonOption[] = [
  { name: 'All', value: types.RestrictedFilter.all },
  { name: 'Restricted', value: types.RestrictedFilter.restricted },
  { name: 'Non-Restricted', value: types.RestrictedFilter.nonrestricted }
]
const defaultParams: types.PathParams = {
  elo: 0,
  format: 'gen9vgc2024reggbo3',
  month: '2024-05',
}

function percent(n: number): string {
  return (n * 100).toFixed(2) + '%';
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
        key={opt.value}
      >{opt.name}</button>
    )
  })

  if (!optionSelected)
    console.warn(`Selected option '${selected}' is not in the list`);

  return <div className={styles.selectorRow}>
    {buttons}
  </div>
}

function SelectorDropdown({ options, selected, onSelectedChange }: {
  options: ButtonOption[], selected: string, onSelectedChange: Function
}) {
  let optionEls = options.map((option: ButtonOption) => {
    return <option 
      value={option.value} 
      key={option.value}
      onClick={() => onSelectedChange(option.value)}
    >{option.name}</option>
  })
  return <select className={styles.selector}>
    {optionEls}
  </select>
}

function SelectorPanel({ params, onParamsChange, restrictedFilter, onRestrictedFilterChange }:
  {
    params: types.PathParams, onParamsChange: (params: types.PathParams) => void,
    restrictedFilter: types.RestrictedFilter, onRestrictedFilterChange: Function
  }
) {

  return <div>
    <SelectorButtonRow
      options={elos}
      selected={params.elo}
      onSelectedChange={(elo: string | number) => onParamsChange({ ...params, elo: elo as number })} />
    <div className={styles.flexRow}>
      <SelectorButtonRow
        options={formats}
        selected={params.format}
        onSelectedChange={(format: string | number) => onParamsChange({ ...params, format: format as string })} />
      <SelectorDropdown
        options={months}
        selected={params.month}
        onSelectedChange={(month: string) => onParamsChange({ ...params, month: month })} />
    </div>
    <SelectorButtonRow
      options={filterOptions}
      selected={restrictedFilter}
      onSelectedChange={onRestrictedFilterChange} />
  </div>
}


function SidePanel({ params, onParamsChange, selectedPokemon, onSelectedPokemonChange }: {
  params: types.PathParams, onParamsChange: (params: types.PathParams) => void,
  selectedPokemon?: string, onSelectedPokemonChange: (selectedPokemon: string) => void
}) {
  let [restrictedFilter, setRestrictedFilter]:
    [types.RestrictedFilter, Function] = useState(types.RestrictedFilter.all)

  let [usage, setUsage]: [types.UsageData[], Function] = useState([]);
  let [status, setStatus]: [types.Status, Function] = useState(types.Status.inProgress)

  useEffect(() => {
    setStatus(types.Status.inProgress)
    getUsageData(params)
      .then(data => {
        setUsage(data);
        setStatus(types.Status.complete)
        if (!selectedPokemon) onSelectedPokemonChange(data[0].name);
      })
      .catch(() => setStatus(types.Status.error));
  }, [params])

  return (
    <div>
      <SelectorPanel
        params={params}
        onParamsChange={onParamsChange}
        restrictedFilter={restrictedFilter}
        onRestrictedFilterChange={setRestrictedFilter} />
      <PokemonList
        data={usage}
        status={status}
        restrictedFilter={restrictedFilter}
        selectedPokemon={selectedPokemon}
        onSelectedPokemonChange={onSelectedPokemonChange} />
    </div>
  )
}

export default function Home() {

  let [params, setParams]: [types.PathParams, (params: types.PathParams) => void] = useState({...defaultParams});
  let [selectedPokemon, setSelectedPokemon]: [string, (pokemon: string) => void] = useState('');
  let [pokemonData, setPokemonData]: [types.PokemonData | undefined, Function] = useState();
  let [infoStatus, setInfoStatus]: [types.Status, Function] = useState(types.Status.inProgress)

  useEffect(() => {
    if (!selectedPokemon) return;
    setInfoStatus(types.Status.inProgress);
    getPokemonData(params, selectedPokemon)
      .then((data) => {
        setPokemonData(data);
        setInfoStatus(types.Status.complete);
      })
      .catch((err) => {
        console.error(err);
        setInfoStatus(types.Status.error);
      })
  }, [params, selectedPokemon])

  return (
    <div className={styles.main}>
      <div className={styles.header}>StatCrusher</div>
      <div className={styles.sideDisplayContainer}>
        <SidePanel 
          params={params} 
          onParamsChange={(params) => setParams({ ...params })}
          selectedPokemon={selectedPokemon}
          onSelectedPokemonChange={setSelectedPokemon} />
      </div>
      <div className={styles.contentPanel}>
        <InfoDisplayContainer
          pokemonData={pokemonData}
          status={infoStatus} />
      </div>
    </div>
  );
}
