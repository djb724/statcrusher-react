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
  {name: '2024-06', value: '2024-06'},
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
  month: '2024-06',
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
      <div className={styles.title}>
        <h1>
          StatCrusher
        </h1>
      </div>
      <div className={styles.panelContainer}>
        <SelectorPanel
          params={params}
          onParamsChange={onParamsChange}
          restrictedFilter={restrictedFilter}
          onRestrictedFilterChange={setRestrictedFilter} />
      </div>
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

  let [params, setParams]: [types.PathParams, (params: types.PathParams) => void] = useState({ ...defaultParams });
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
      <div className={styles.header}>
        {/* <h2 className={styles.title}>StatCrusher</h2> */}
        <a
          title={'Twitter'}
          href={"https://twiiter.com/QueejiboVGC"}
          className={styles.iconLink}
        >
          {/* Twitter */}
          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 50 50">
            <path d="M 50.0625 10.4375 C 48.214844 11.257813 46.234375 11.808594 44.152344 12.058594 C 46.277344 10.785156 47.910156 8.769531 48.675781 6.371094 C 46.691406 7.546875 44.484375 8.402344 42.144531 8.863281 C 40.269531 6.863281 37.597656 5.617188 34.640625 5.617188 C 28.960938 5.617188 24.355469 10.21875 24.355469 15.898438 C 24.355469 16.703125 24.449219 17.488281 24.625 18.242188 C 16.078125 17.8125 8.503906 13.71875 3.429688 7.496094 C 2.542969 9.019531 2.039063 10.785156 2.039063 12.667969 C 2.039063 16.234375 3.851563 19.382813 6.613281 21.230469 C 4.925781 21.175781 3.339844 20.710938 1.953125 19.941406 C 1.953125 19.984375 1.953125 20.027344 1.953125 20.070313 C 1.953125 25.054688 5.5 29.207031 10.199219 30.15625 C 9.339844 30.390625 8.429688 30.515625 7.492188 30.515625 C 6.828125 30.515625 6.183594 30.453125 5.554688 30.328125 C 6.867188 34.410156 10.664063 37.390625 15.160156 37.472656 C 11.644531 40.230469 7.210938 41.871094 2.390625 41.871094 C 1.558594 41.871094 0.742188 41.824219 -0.0585938 41.726563 C 4.488281 44.648438 9.894531 46.347656 15.703125 46.347656 C 34.617188 46.347656 44.960938 30.679688 44.960938 17.09375 C 44.960938 16.648438 44.949219 16.199219 44.933594 15.761719 C 46.941406 14.3125 48.683594 12.5 50.0625 10.4375 Z"></path>
          </svg>
        </a>
        <a
          title={'Patreon'}
          href={""}
          className={styles.iconLink}
        >
          {/* Patreon */}
          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 50 50">
            <path d="M15 7H9C8.447 7 8 7.447 8 8v33c0 .553.447 1 1 1h6c.553 0 1-.447 1-1V8C16 7.447 15.553 7 15 7zM31 7A13 13 0 1031 33 13 13 0 1031 7z"></path>
          </svg>
        </a>
      </div>
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
