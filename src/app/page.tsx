'use client'

import styles from "./page.module.css";
import * as types from './types';
import { getUsageData } from './api';
import PokemonList from "./pokemon-list";
import { useState, useEffect } from "react";
import { InfoDisplay } from "./pokemon-info";
import { conc } from './util';
import { Button, SelectorButtonRow } from "./components";

const elos: types.ButtonOption[] = [
  { name: 'Any Elo', value: 0 },
  { name: '1500+', value: 1500 },
  { name: '1630+', value: 1630 },
  { name: '1760+', value: 1760 }
]
const formats: types.ButtonOption[] = [
  { name: 'Bo1', value: 'gen9vgc2024regh' },
  { name: 'Bo3', value: 'gen9vgc2024reghbo3' }
]
const months: types.ButtonOption[] = [
  { name: '2024-09', value: '2024-09' },
  { name: '2024-08', value: '2024-08' }
  // { name: '2024-07', value: '2024-07' },
  // { name: '2024-06', value: '2024-06' },
  // { name: '2024-05', value: '2024-05' },
  // { name: '2024-04', value: '2024-04' }
]
const filterOptions: types.ButtonOption[] = [
  { name: 'All', value: types.RestrictedFilter.all },
  { name: 'Restricted', value: types.RestrictedFilter.restricted },
  { name: 'Non-Restricted', value: types.RestrictedFilter.nonrestricted }
]
const defaultParams: types.PathParams = {
  elo: 0,
  format: 'gen9vgc2024reghbo3',
  month: '2024-09',
}
const showRestrictedFilter = false;

function SelectorDropdown({ options, selected, onSelectedChange }: {
  options: types.ButtonOption[], selected: string, onSelectedChange: Function
}) {
  let optionEls = options.map((option: types.ButtonOption) => {
    return <option
      value={option.value}
      key={option.value}
    >{option.name}</option>
  })
  return <select className={styles.selector} value={selected} onChange={(event) => { onSelectedChange(event.target.value) }}>
    {optionEls}
  </select>
}

function SelectorPanel({ params, onParamsChange, restrictedFilter, onRestrictedFilterChange }:
  {
    params: types.PathParams, onParamsChange: (params: types.PathParams) => void,
    restrictedFilter: types.RestrictedFilter, onRestrictedFilterChange: (selected: string) => void
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
    {showRestrictedFilter && <SelectorButtonRow
      options={filterOptions}
      selected={restrictedFilter}
      onSelectedChange={onRestrictedFilterChange} />}
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
      <div className={styles.panelContainer}>
        <SelectorPanel
          params={params}
          onParamsChange={onParamsChange}
          restrictedFilter={restrictedFilter}
          onRestrictedFilterChange={(s) => setRestrictedFilter(s)} />
      </div>
      <div></div>
      <PokemonList
        data={usage}
        status={status}
        restrictedFilter={restrictedFilter}
        selectedPokemon={selectedPokemon}
        onSelectedPokemonChange={onSelectedPokemonChange} />
    </div>
  )
}

function SlideInComponent({ open, onOpenChange, children }: {
  open: boolean,
  onOpenChange: Function,
  children: JSX.Element[]
}) {
  return <div className={
    conc(styles.slideInComponent,
      open ? styles.slideInComponentOpen : styles.slideInComponentClosed
    )}>
    <div className={conc(styles.slideInContainer, styles.scrollable)}>
      {children}
    </div>
  </div>
}

export default function Home(): JSX.Element {

  let [params, setParams]: [types.PathParams, (params: types.PathParams) => void] = useState({ ...defaultParams });
  let [selectedPokemon, setSelectedPokemon]: [string, (pokemon: string) => void] = useState('Metagame');
  let [open, setOpen]: [boolean, Function] = useState(true);

  return (
    <div className={styles.main}>
      <div className={styles.header}>
        {/* <h2 className={styles.title}>StatCrusher</h2> */}
        <button
          onClick={() => setOpen(true)}
          className={conc(styles.buttonIcon, styles.listIcon)}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 489.7 489.7">
            <g>
              <g>
                <path d="M52.7,134.75c29.1,0,52.7-23.7,52.7-52.7s-23.6-52.8-52.7-52.8S0,52.95,0,81.95S23.7,134.75,52.7,134.75z M52.7,53.75
			c15.6,0,28.2,12.7,28.2,28.2s-12.7,28.2-28.2,28.2s-28.2-12.7-28.2-28.2S37.2,53.75,52.7,53.75z"/>
                <path d="M52.7,297.55c29.1,0,52.7-23.7,52.7-52.7s-23.6-52.7-52.7-52.7S0,215.75,0,244.85S23.7,297.55,52.7,297.55z M52.7,216.65
			c15.6,0,28.2,12.7,28.2,28.2s-12.7,28.2-28.2,28.2s-28.2-12.6-28.2-28.2S37.2,216.65,52.7,216.65z"/>
                <path d="M52.7,460.45c29.1,0,52.7-23.7,52.7-52.7c0-29.1-23.7-52.7-52.7-52.7S0,378.75,0,407.75C0,436.75,23.7,460.45,52.7,460.45
			z M52.7,379.45c15.6,0,28.2,12.7,28.2,28.2c0,15.6-12.7,28.2-28.2,28.2s-28.2-12.7-28.2-28.2C24.5,392.15,37.2,379.45,52.7,379.45
			z"/>
                <path d="M175.9,94.25h301.5c6.8,0,12.3-5.5,12.3-12.3s-5.5-12.3-12.3-12.3H175.9c-6.8,0-12.3,5.5-12.3,12.3
			S169.1,94.25,175.9,94.25z"/>
                <path d="M175.9,257.15h301.5c6.8,0,12.3-5.5,12.3-12.3s-5.5-12.3-12.3-12.3H175.9c-6.8,0-12.3,5.5-12.3,12.3
			S169.1,257.15,175.9,257.15z"/>
                <path d="M175.9,419.95h301.5c6.8,0,12.3-5.5,12.3-12.3s-5.5-12.3-12.3-12.3H175.9c-6.8,0-12.3,5.5-12.3,12.3
			S169.1,419.95,175.9,419.95z"/>
              </g>
            </g>
          </svg>
        </button>
        <div className={styles.socialLinks}>
          <a
            title={'Twitter'}
            href={"https://twitter.com/QueejiboVGC"}
            className={styles.buttonIcon}
          >
            {/* Twitter */}
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 50 50">
              <path d="M 50.0625 10.4375 C 48.214844 11.257813 46.234375 11.808594 44.152344 12.058594 C 46.277344 10.785156 47.910156 8.769531 48.675781 6.371094 C 46.691406 7.546875 44.484375 8.402344 42.144531 8.863281 C 40.269531 6.863281 37.597656 5.617188 34.640625 5.617188 C 28.960938 5.617188 24.355469 10.21875 24.355469 15.898438 C 24.355469 16.703125 24.449219 17.488281 24.625 18.242188 C 16.078125 17.8125 8.503906 13.71875 3.429688 7.496094 C 2.542969 9.019531 2.039063 10.785156 2.039063 12.667969 C 2.039063 16.234375 3.851563 19.382813 6.613281 21.230469 C 4.925781 21.175781 3.339844 20.710938 1.953125 19.941406 C 1.953125 19.984375 1.953125 20.027344 1.953125 20.070313 C 1.953125 25.054688 5.5 29.207031 10.199219 30.15625 C 9.339844 30.390625 8.429688 30.515625 7.492188 30.515625 C 6.828125 30.515625 6.183594 30.453125 5.554688 30.328125 C 6.867188 34.410156 10.664063 37.390625 15.160156 37.472656 C 11.644531 40.230469 7.210938 41.871094 2.390625 41.871094 C 1.558594 41.871094 0.742188 41.824219 -0.0585938 41.726563 C 4.488281 44.648438 9.894531 46.347656 15.703125 46.347656 C 34.617188 46.347656 44.960938 30.679688 44.960938 17.09375 C 44.960938 16.648438 44.949219 16.199219 44.933594 15.761719 C 46.941406 14.3125 48.683594 12.5 50.0625 10.4375 Z"></path>
            </svg>
          </a>
          <a
            title={'Patreon'}
            href={"https://patreon.com/LoveThyEnemy?utm_medium=unknown&utm_source=join_link&utm_campaign=creatorshare_creator&utm_content=copyLink"}
            className={styles.buttonIcon}
          >
            {/* Patreon */}
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 50 50">
              <path d="M15 7H9C8.447 7 8 7.447 8 8v33c0 .553.447 1 1 1h6c.553 0 1-.447 1-1V8C16 7.447 15.553 7 15 7zM31 7A13 13 0 1031 33 13 13 0 1031 7z"></path>
            </svg>
          </a>
        </div>
      </div>
      <div className={conc(styles.sideDisplayContainer, styles.scrollable)}>
        <div className={styles.title}>
          <h1>
            StatCrusher
          </h1>
        </div>
        <SidePanel
          params={params}
          onParamsChange={(params) => setParams({ ...params })}
          selectedPokemon={selectedPokemon}
          onSelectedPokemonChange={setSelectedPokemon} />
      </div>
      <div className={conc(styles.contentPanel, styles.scrollable)}>
        <InfoDisplay
          params={params}
          selectedPokemon={selectedPokemon} />
      </div>
      <div
        onClick={() => setOpen(false)}
        className={conc(styles.cover, (open ? styles.coverOpen : ''))} />
      <SlideInComponent open={open} onOpenChange={setOpen}>
        <div className={styles.listCloseContainer}>
          <button
            onClick={() => setOpen(false)}
            className={conc(styles.buttonIcon, styles.listClose)}>
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM8.96963 8.96965C9.26252 8.67676 9.73739 8.67676 10.0303 8.96965L12 10.9393L13.9696 8.96967C14.2625 8.67678 14.7374 8.67678 15.0303 8.96967C15.3232 9.26256 15.3232 9.73744 15.0303 10.0303L13.0606 12L15.0303 13.9696C15.3232 14.2625 15.3232 14.7374 15.0303 15.0303C14.7374 15.3232 14.2625 15.3232 13.9696 15.0303L12 13.0607L10.0303 15.0303C9.73742 15.3232 9.26254 15.3232 8.96965 15.0303C8.67676 14.7374 8.67676 14.2625 8.96965 13.9697L10.9393 12L8.96963 10.0303C8.67673 9.73742 8.67673 9.26254 8.96963 8.96965Z" />
            </svg>
          </button>
        </div>
        <SidePanel
          params={params}
          onParamsChange={(params) => setParams({ ...params })}
          selectedPokemon={selectedPokemon}
          onSelectedPokemonChange={(pokemon) => {
            setOpen(false);
            setSelectedPokemon(pokemon);
          }} />
      </SlideInComponent>
    </div>
  );
}
