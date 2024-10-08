import styles from "./components.module.css";
import { ButtonOption } from "./types";
import { conc } from "./util";

export function LoadingComponent(): JSX.Element {
  return <div></div>
}

export function ErrorComponent(): JSX.Element {
  return <div></div>
}

export function TextBox( {value, onValueChange}: {
  value: string,
  onValueChange: Function
}): JSX.Element {
  return <input
    type={'text'} 
    value={value}
    className={styles.textBox} 
    onChange={(e) => onValueChange(e.target.value)}
    onClick={(e) => (e.target as HTMLInputElement).select()}></input>
}

export function Button({ selected = false, onClick, children }: {
  selected?: boolean
  onClick: () => void,
  children: string
}): JSX.Element {
  return <button 
    className={conc(styles.button, selected ? styles.buttonSelected : '')} 
    onClick={onClick}>{children}</button>
}

export function SelectorButtonRow({ options, selected, onSelectedChange }: {
  options: ButtonOption[],
  selected: any,
  onSelectedChange: (selected: string) => void
}) {
  let optionSelected = false;

  let buttons: any = options.map((opt: ButtonOption) => {
    if (selected === opt.value) optionSelected = true;
    return (
      <Button
        selected={selected === opt.value}
        onClick={() => onSelectedChange(opt.value)}
        key={opt.value}
      >{opt.name}</Button>
    )
  })

  if (!optionSelected)
    console.warn(`Selected option '${selected}' is not in the list`);

  return <div className={styles.selectorRow}>
    {buttons}
  </div>
}


