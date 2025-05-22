import { AggregateData, DisplayData, PathParams, PokemonData, StatsFrequencies, Status, ValueFrequency } from "./types"
import { conc, percent } from "./util";
import styles from "./pokemon-info.module.css";
import { useState, useEffect, DO_NOT_USE_OR_YOU_WILL_BE_FIRED_EXPERIMENTAL_FORM_ACTIONS } from "react";
import { Chart, ChartData, registerables, TooltipItem } from "chart.js";
import { Bar } from "react-chartjs-2";
import Image from "next/image";
import { getPokemonData } from "./api";
import { ErrorComponent, Loading, TextBox, Button } from "./components";

Chart.register(...registerables);

const chartOptions = {
  legend: false,
  responsive: true,
  scales: {
    y: {
      type: 'linear',
      ticks: {
        callback: function (value: string | number) {
          return (+value * 100).toFixed(0) + '%';
        }
      }
    },
    x: {
      title: {
        dispaly: true,
        text: 'Stat Value'
      }
    }
  },
  plugins: {
    legend: false,
    tooltip: {
      titleAlign: 'center',
      displayColors: false,
      titleColor: '#911', // change for others
      callbacks: {
        title: (tooltipItem: TooltipItem<'bar'>[]) => {
          return '= ' + tooltipItem[0].label
        },
        label: (tooltipItem: TooltipItem<'bar'>) => {
          let value = +(tooltipItem.formattedValue || 0)
          return percent(value)
        }
      }
    }
  }
}
const chartOptionsAsc = {
  legend: false,
  responsive: true,
  scales: {
    y: {
      type: 'linear',
      ticks: {
        callback: function (value: string | number) {
          return (+value * 100).toFixed(0) + '%';
        }
      }
    },
    x: {
      title: {
        dispaly: true,
        text: 'Stat Value'
      }
    }
  },
  plugins: {
    legend: false,
    tooltip: {
      titleAlign: 'center',
      displayColors: false,
      titleColor: '#181',
      callbacks: {
        title: (tooltipItem: TooltipItem<'bar'>[]) => {
          return '\u2264 ' + tooltipItem[0].label
        },
        label: (tooltipItem: TooltipItem<'bar'>) => {
          let value = +(tooltipItem.formattedValue || 0)
          return percent(value)
        }
      }
    }
  }
}
const chartOptionsDesc = {
  legend: false,
  responsive: true,
  scales: {
    y: {
      type: 'linear',
      ticks: {
        callback: function (value: string | number) {
          return (+value * 100).toFixed(0) + '%';
        }
      }
    },
    x: {
      title: {
        dispaly: true,
        text: 'Stat Value'
      }
    }
  },
  plugins: {
    legend: false,
    tooltip: {
      titleAlign: 'center',
      displayColors: false,
      titleColor: '#159',
      callbacks: {
        title: (tooltipItem: TooltipItem<'bar'>[]) => {
          return '\u2265 ' + tooltipItem[0].label
        },
        label: (tooltipItem: TooltipItem<'bar'>) => {
          let value = +(tooltipItem.formattedValue || 0)
          return percent(value)
        }
      }
    }
  }
}

function Types({ types }: { types: string[] }) {
  return <div className={styles.types}>{types.join(' / ')}</div>
}

function Histogram({ datasetType, data, min, max }: {
  datasetType: number,
  data: ValueFrequency[],
  min: number,
  max: number
}) {

  let datasetOptions = {}
  let options = chartOptions;
  switch (datasetType) {
    case 0:
      datasetOptions = {
        label: 'Frequency',
        backgroundColor: '#911',
        hoverBackgroundColor: '#711'
      }
      options = chartOptions;
      break;
    case 1:
      datasetOptions = {
        label: 'Cumulative Frequency',
        backgroundColor: '#181',
        hoverBackgroundColor: '#161'
      }
      options = chartOptionsAsc;
      break;
    case 2:
      datasetOptions = {
        label: 'Cumulative Descending Frequency',
        backgroundColor: '#159',
        hoverBackgroundColor: '#147'
      }
      options = chartOptionsDesc;
      break;
  }

  data = data.filter(d => +d.value >= min && +d.value <= max)

  const chartData = {
    labels: data.map(a => a.value),
    datasets: [{
      data: data.map(a => a.usage),
      ...datasetOptions
    }]
  };


  return <Bar data={chartData} options={options as any} />
}

function InfoHeader({ pokemonData }: { pokemonData: PokemonData }) {

  let imageName = `${pokemonData.dexNum.toString().padStart(4, '0')} ${pokemonData.name}`
  return <div className={conc(styles.boxSection, styles.header)}>
    <div className={styles.headerImageContainer}>
      <div className={styles.headerImage}>
        <Image
          src={`/official-art/${imageName}.png`}
          alt={''}
          width={175}
          height={175}
        />
      </div>
    </div>
    <div>
      <h3>{pokemonData.name}</h3>
      <Types types={pokemonData.type} />
      <table className={styles.headerTable}>
        <tbody>
          <tr>
            <td>Usage:</td>
            <td>{percent(pokemonData.usageRate)}</td>
          </tr>
          <tr>
            <td>Raw Count:</td>
            <td>{pokemonData.rawCount}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
}

function truncateData(data: ValueFrequency[], limit: number): ValueFrequency[] {
  if (data.length < limit) return data;

  let ret: ValueFrequency[] = data.slice(0, limit);
  ret.push({
    value: "Other",
    usage: data.slice(10).reduce((sum, vf) => sum + vf.usage, 0)
  })
  return ret;
}

function AbilitiesTable({ data }: {
  data: ValueFrequency[]
}) {
  data = truncateData(data, 10);
  let rows = data.map(row => {
    return (<tr key={row.value} className={styles.tableRow}>
      <td>{row.value}</td>
      <td>{percent(row.usage)}</td>
    </tr>)
  })
  return <table cellPadding={0} cellSpacing={0} className={styles.table}>
    <tbody>{rows}</tbody>
  </table>
}

function ItemsTable({ data }: {
  data: ValueFrequency[]
}) {
  data = truncateData(data, 10);
  let rows = data.map(row => {
    return (<tr key={row.value} className={styles.tableRow}>
      <td>{row.value}</td>
      <td>{percent(row.usage)}</td>
    </tr>)
  })
  return <table cellSpacing={0} cellPadding={0} className={styles.table}>
    <tbody>{rows}</tbody>
  </table>
}

function MovesTable({ data }: {
  data: ValueFrequency[]
}) {
  data = truncateData(data, 12);
  let rows = data.map(row => {
    return (<tr key={row.value} className={styles.tableRow}>
      <td>{row.value}</td>
      <td>{percent(row.usage)}</td>
    </tr>)
  })
  return <table cellSpacing={0} cellPadding={0} className={styles.table}>
    <tbody>{rows}</tbody>
  </table>
}

function TeammatesTable({ data }: {
  data: ValueFrequency[]
}) {
  data = truncateData(data, 50);
  let rows = data.map(row => {
    return <tr key={row.value} className={styles.tableRow}>
      <td>{row.value}</td>
      <td>{percent(row.usage)}</td>
    </tr>
  })
  return <div className={styles.teammatesTableContainer}>
    <table cellSpacing={0} cellPadding={0} className={conc(styles.table)}>
      <tbody>{rows}</tbody>
    </table>
  </div>
}

function NaturesTable({ data }: {
  data: ValueFrequency[]
}) {
  data = truncateData(data, 8);
  let rows = data.map(row => {
    return (<tr key={row.value} className={styles.tableRow}>
      <td className={styles.tableRowSubj}>{row.value}</td>
      <td className={styles.tableRowValue}>{percent(row.usage)}</td>
    </tr>)
  })
  return <table cellSpacing={0} cellPadding={0} className={styles.table}>
    <tbody>{rows}</tbody>
  </table>
}

function TeraTypesTable({ data }: {
  data: ValueFrequency[]
}) {
  data = truncateData(data, 8);
  let rows = data.map(row => {
    return (<tr key={row.value} className={styles.tableRow}>
      <td className={styles.tableRowSubj}>{row.value}</td>
      <td className={styles.tableRowValue}>{percent(row.usage)}</td>
    </tr>)
  });
  return <table cellSpacing={0} cellPadding={0} className={styles.table}>
    <tbody>{rows}</tbody>
  </table>
}

function StatsTabs({ selected, onSelectedChange }: {
  selected: number,
  onSelectedChange: Function
}) {
  return <div className={styles.tabsContainer}>
    <div
      className={conc(styles.tab, styles.tabFreq, (selected === 0) ? styles.selected : '')}
      onClick={() => onSelectedChange(0)}
      title={'Frequency'}
    >
      <svg viewBox="0 0 20 20" className={styles.tabIcon}>
        <rect x="0" y="14" height="6" width="6"></rect>
        <rect x="7" y="0" height="20" width="6"></rect>
        <rect x="14" y="6" height="14" width="6"></rect>
      </svg>
    </div>
    <div
      className={conc(styles.tab, styles.tabAsc, (selected === 1) ? styles.selected : '')}
      onClick={() => onSelectedChange(1)}
      title={'Cumulative Frequency'}
    >
      <svg viewBox="0 0 20 20" className={styles.tabIcon}>
        <rect x="0" y="14" height="6" width="6"></rect>
        <rect x="7" y="8" height="12" width="6"></rect>
        <rect x="14" y="0" height="20" width="6"></rect>
      </svg>
    </div>
    <div
      className={conc(styles.tab, styles.tabDesc, (selected === 2) ? styles.selected : '')}
      onClick={() => onSelectedChange(2)}
      title={'Cumulative Descending'}
    >
      <svg viewBox="0 0 20 20" className={styles.tabIcon}>
        <rect x="0" y="0" height="20" width="6"></rect>
        <rect x="7" y="8" height="12" width="6"></rect>
        <rect x="14" y="14" height="6" width="6"></rect>
      </svg>
    </div>
  </div>
}

function RangeSelector({ min, onMinChange, max, onMaxChange, onReset }: {
  min: number, onMinChange: Function,
  max: number, onMaxChange: Function,
  onReset: () => void
}): JSX.Element {

  return <div className={styles.rangeSelectorContainer}>
    <span>Range:</span>
    <TextBox value={'' + min} onValueChange={(v: string) => onMinChange(+v)} />
    <span>-</span>
    <TextBox value={'' + max} onValueChange={(v: string) => onMaxChange(+v)} />
    <Button onClick={onReset}>Reset</Button>
  </div>
}

function statsTransform(data: ValueFrequency[], min: number, max: number, multiplier: number) {
  let filtered = data.filter((p: ValueFrequency) => +p.value >= min && +p.value <= max)
    
}

function MultiplierSelector({ multiplier, onMultiplierChange }: {
  multiplier: number,
  onMultiplierChange: (multiplier: number) => void
}) {
  // TODO
  return
}

function StatsTable({ stats }: {
  stats: StatsFrequencies
}) {
  let [selected, setSelected] = useState(0);
  let [min, setMin] = useState(stats.min);
  let [max, setMax] = useState(stats.max);
  // let [multiplier, setMultiplier] = useState(0);

  function resetRange() {
    setMin(stats.min);
    setMax(stats.max);
  }

  return <div>
    <table className={styles.statsTendenciesTable} cellSpacing={0}>
      <tbody>
        <tr>
          <td width={'50%'}>Median:</td>
          <td width={'50%'}>{stats.quartile2}</td>
        </tr>
        <tr>
          <td width={'50%'}>Interquartile Range:</td>
          <td width={'50%'}>{stats.quartile1} - {stats.quartile3}</td>
        </tr>
        <tr>
          <td width={'50%'}>Mean:</td>
          <td width={'50%'}>{stats.mean.toFixed(2)}</td>
        </tr>
      </tbody>
    </table>
    <RangeSelector min={min} onMinChange={setMin} 
      max={max} onMaxChange={setMax} onReset={resetRange}/>
    {/* <MultiplierSelector /> */}
    <StatsTabs selected={selected} onSelectedChange={setSelected} />
    {selected === 0 && <Histogram datasetType={0} data={stats.frequency} min={min} max={max} />}
    {selected === 1 && <Histogram datasetType={1} data={stats.cumulativeFreq} min={min} max={max} />}
    {selected === 2 && <Histogram datasetType={2} data={stats.cumulativeDesc} min={min} max={max} />}

  </div>
}

function ExpandableContent({ expanded, children }: {
  expanded: boolean,
  children: any
}) {
  return <div className={expanded ? styles.expanded : styles.retracted}>
    {children}
  </div>
}

function Expandable({ expanded = true, title, children }: {
  expanded: boolean,
  title: string,
  children: any
}) {
  let [_expanded, setExpanded] = useState(expanded);
  return <div className={conc(styles.boxSection, _expanded ? styles.expanded : styles.retracted)}>
    <div
      className={styles.expandableHeader}
      onClick={() => { setExpanded(!_expanded) }}
    >
      <h4 className={styles.expandableTitle}>{title}</h4>
      <div className={styles.expandIcon}>{_expanded ? "-" : "+"}</div>
    </div>
    <ExpandableContent expanded={_expanded}>
      {children}
    </ExpandableContent>
  </div>
}

export function PokemonInfo({ data }: {
  data: PokemonData,
}) {
  if (!data) return;
  
  return <div>
    <InfoHeader pokemonData={data} />

    <div className={styles.infoContent}>
      <div className={styles.contentSection1}>
        <Expandable title={`Speed (${data.baseStats.spd})`} expanded={true}>
          <StatsTable stats={data.stats.spd} />
          <div className={styles.footnote}>
            * 0 IVs is assumed when instances have 0 EVs and a hindering nature.
          </div>
        </Expandable>
        <Expandable title={`HP (${data.baseStats.hp})`} expanded={false}>
          <StatsTable stats={data.stats.hp} />
        </Expandable>
        <Expandable title={`Attack (${data.baseStats.atk})`} expanded={false}>
          <StatsTable stats={data.stats.atk} />
          <div className={styles.footnote}>
            * 0 IVs is assumed when instances have 0 EVs and a hindering nature.
          </div>
        </Expandable>
        <Expandable title={`Defense (${data.baseStats.def})`} expanded={false}>
          <StatsTable stats={data.stats.def} />
        </Expandable>
        <Expandable title={`Special Attack (${data.baseStats.satk})`} expanded={false}>
          <StatsTable stats={data.stats.satk} />
        </Expandable>
        <Expandable title={`Special Defense (${data.baseStats.sdef})`} expanded={false}>
          <StatsTable stats={data.stats.sdef} />
        </Expandable>
      </div>
      <div className={styles.contentSection2}>
        {data.teraTypes &&
          <Expandable title={"Tera Types"} expanded={true}>
            <TeraTypesTable data={data.teraTypes} />
          </Expandable>
        }
        <Expandable title={"Abilities"} expanded={true}>
          <AbilitiesTable data={data.abilities} />
        </Expandable>
        <Expandable title={"Items"} expanded={true}>
          <ItemsTable data={data.items} />
        </Expandable>
        <Expandable title={"Moves"} expanded={true}>
          <MovesTable data={data.moves} />
        </Expandable>
        <Expandable title={"Teammates"} expanded={false}>
          <TeammatesTable data={data.teammates} />
        </Expandable>
        <Expandable title={"Natures"} expanded={false}>
          <NaturesTable data={data.natures} />
        </Expandable>
      </div>
    </div>
  </div>
}

export function AggregateInfo({ data }: {
  data: AggregateData,
}): JSX.Element {

  if (!data) return <ErrorComponent />;

  return (<div>

    <div className={styles.aggregateContent}>
      <Expandable title={`Speed`} expanded={true}>
        <StatsTable stats={data.stats.spd} />
        <div className={styles.footnote}>
          * 0 IVs is assumed when instances have 0 EVs and a hindering nature.
        </div>
      </Expandable>
      <Expandable title={`HP`} expanded={false}>
        <StatsTable stats={data.stats.hp} />
      </Expandable>
      <Expandable title={`Attack`} expanded={false}>
        <StatsTable stats={data.stats.atk} />
        <div className={styles.footnote}>
          * 0 IVs is assumed when instances have 0 EVs and a hindering nature.
        </div>
      </Expandable>
      <Expandable title={`Defense`} expanded={false}>
        <StatsTable stats={data.stats.def} />
      </Expandable>
      <Expandable title={`Special Attack`} expanded={false}>
        <StatsTable stats={data.stats.satk} />
      </Expandable>
      <Expandable title={`Special Defense`} expanded={false}>
        <StatsTable stats={data.stats.sdef} />
      </Expandable>
    </div>
  </div>)
}

export function InfoDisplay({ params, selectedPokemon }: {
  params: PathParams,
  selectedPokemon: string
}): JSX.Element {

  let [status, setStatus]: [Status, Function] = useState(Status.inProgress)
  let [pokemonData, setPokemonData]: [PokemonData | undefined, Function] = useState();
  let [aggregateData, setAggregateData]: [AggregateData | undefined, Function] = useState();

  useEffect(() => {
    if (!selectedPokemon) return;
    setStatus(Status.inProgress);
    getPokemonData(params, selectedPokemon)
      .then((data) => {
        if (selectedPokemon === 'Metagame') {
          setAggregateData(data);
          setStatus(Status.complete);
        }
        else {
          setPokemonData(data);
          setStatus(Status.complete);
        }
      })
      .catch((err) => {
        console.error(err);
        setStatus(Status.error);
      })
  }, [params.bestOf, params.elo, params.month, selectedPokemon])

  if (status === Status.inProgress) return <Loading />
  if (status === Status.error) return <ErrorComponent />

  if (selectedPokemon === 'Metagame') 
    return <AggregateInfo 
      data={aggregateData as AggregateData} />
  
  return <PokemonInfo 
    data={pokemonData as PokemonData}/>
}

