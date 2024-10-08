// import styles from './pokemon-info.module.css'

// export class StatsTable {

//   render(): JSX.Element {
//     return <div>
//       <table className={styles.statsTendenciesTable} cellSpacing={0}>
//         <tbody>
//           <tr>
//             <td width={'50%'}>Median:</td>
//             <td width={'50%'}>{stats.quartile2}</td>
//           </tr>
//           <tr>
//             <td width={'50%'}>Interquartile Range:</td>
//             <td width={'50%'}>{stats.quartile1} - {stats.quartile3}</td>
//           </tr>
//           <tr>
//             <td width={'50%'}>Mean:</td>
//             <td width={'50%'}>{stats.mean.toFixed(2)}</td>
//           </tr>
//         </tbody>
//       </table>
//       <RangeSelector min={min} onMinChange={setMin}
//         max={max} onMaxChange={setMax} onReset={resetRange} />
//       {/* <MultiplierSelector /> */}
//       <StatsTabs selected={selected} onSelectedChange={setSelected} />
//       {selected === 0 && <Histogram stat={'speed'} datasetType={0} data={stats.frequency} />}
//       {selected === 1 && <Histogram stat={'speed'} datasetType={1} data={stats.cumulativeFreq} />}
//       {selected === 2 && <Histogram stat={'speed'} datasetType={2} data={stats.cumulativeDesc} />}

//     </div>
//   }
// }