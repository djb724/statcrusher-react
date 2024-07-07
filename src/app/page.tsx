'use client'

import Image from "next/image";
import styles from "./page.module.css";
import {usageData} from './types';
import {getUsageData, getPokemonData} from './api';
import PokemonList from "./pokemon-list";
import { useState } from "react";

export default async function Home() {
  let [elo, setElo] = useState(0);
  let [format, setFormat] = useState('gen9vgc2024reggbo3');
  let [month, setMonth] = useState('2024-04');
  let [restrictedFilter, setRestrictedFilter] = useState('all');
  let [pokemon, setPokemon] = useState('');
  
  
  let usage: usageData[] = await getUsageData(0);

  return (
    <div className={styles.main}>
      <div className={styles.header}>StatCrusher</div>
      <div className={styles.sideDisplayContainer}>
        <div className={styles.eloSelector}>
          <button className={styles.selector}>0</button>
          <button className={styles.selector}>1500</button>
          <button className={styles.selector}>1630</button>
          <button className={styles.selector}>1760</button>
        </div>
        <div className={styles.formatSelector}>
          <button className={styles.selector}>Bo1</button>
          <button className={styles.selector}>Bo3</button>
        </div>
        <div className={styles.timeSelecter}>
        </div>
        <div className={styles.restrictedFilter}>
          <button className={styles.selector}>All</button>
          <button className={styles.selector}>Restricted</button>
          <button className={styles.selector}>Non-Restricted</button>
        </div>
        <PokemonList data={usage} />
      </div>
    </div>
  );
}
