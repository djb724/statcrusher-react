import styles from "./components.module.css";
import { useState, useEffect } from "react"
import { ButtonOption } from "./types";
import { conc } from "./util";
import Image from 'next/image';

export function LoadingComponent(): JSX.Element {
  return <div></div>
}

export function ErrorComponent(): JSX.Element {
  return <div></div>
}

export function TextBox({ value, onValueChange }: {
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

export function Dropdown({ options, selected, onSelectedChange }: {
  options: ButtonOption[], selected: string, onSelectedChange: Function
}) {
  let optionEls = options.map((option: ButtonOption) => {
    return <option
      className={styles.dropdownOption}
      value={option.value}
      key={option.value}
    >{option.name}</option>
  })
  return <select className={styles.dropdown} value={selected} onChange={(event) => { onSelectedChange(event.target.value) }}>
    {optionEls}
  </select>
}

export function DropdownOptions({ options, selected, onSelectedChange }: {
  options: ButtonOption[], selected: string, onSelectedChange: Function
}) {
  let optionEls = options.map((option: ButtonOption) => {
	return <div
	  className={styles.dropdownOption}
	  key={option.value}
	  onClick={() => onSelectedChange(option.value)}
	>{option.name}</div>
  })
  return <div className={styles.dropdownOptionsContainer}>
  {optionEls}
  </div>
}

export function CustomDropdown({ options, selected, onSelectedChange }: {
  options: ButtonOption[], selected: string, onSelectedChange: Function
}) {
  let [showOptions, setShowOptions] = useState<boolean>(false);
  function toggleDropdownOptions() {
	setShowOptions(o => !o);
  }

  function handleOptionClick(value: any) {
	onSelectedChange(value);
	setShowOptions(false);
  }

  let opts = options.map(opt => {
	const optStyle = conc(
	  styles.dropdownOption,
	  opt.value == selected ? styles.dropdownOptionSelected : ""
	)
	return <div 
	  className={optStyle}
	  onClick={() => handleOptionClick(opt.value)}>
	  {opt.name}
	</div>
  })

  function DropdownOptionList({ options }: {
	options: JSX.Element[]
  }) {
	useEffect(() => {
	  // Hack to let the handleOptionClick event happens before the
	  // element gets deleted
	  let clickHandler = () => setTimeout(() => setShowOptions(false), 1);
	  document.body.addEventListener("click", clickHandler);
	  return () => {
		document.body.removeEventListener("click", clickHandler);
	  }
	}, []);
	return <div className={styles.dropdownOptionList}>
	  {options}
	</div>
  }

  return <div className={styles.dropdownContainer}>
	<button className={styles.dropdown}
	  onClick={toggleDropdownOptions}>
	  {options.find(opt => opt.value == selected)?.name || "Invalid option"}
	</button>
	{showOptions && <DropdownOptionList options={opts} />}
  </div>
}


export function SearchBar({ value, onValueChange }: {
  value: string, onValueChange: Function
}) {
  return <div className={styles.searchBarContainer}>
    <input
      type={'text'}
      value={value}
      className={styles.searchBar}
      onChange={(e) => onValueChange(e.target.value)}
      onClick={(e) => (e.target as HTMLInputElement).select()} >
    </input>
    <svg className={styles.searchBarIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <button className={styles.searchBarClose} onClick={() => onValueChange('')} title={'Clear Search'}>
      <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
        <path d="M195.2 195.2a64 64 0 0 1 90.496 0L512 421.504 738.304 195.2a64 64 0 0 1 90.496 90.496L602.496 512 828.8 738.304a64 64 0 0 1-90.496 90.496L512 602.496 285.696 828.8a64 64 0 0 1-90.496-90.496L421.504 512 195.2 285.696a64 64 0 0 1 0-90.496z" />
      </svg>
    </button>
  </div>

}

export function Loading() {
  return <div className={styles.loadingContainer}>
    <div className={styles.loading}>
      <Image className={styles.bounce1}
        src={"/beldum-loading.png"}
        alt=""
        width={64}
        height={64} />
      <Image className={styles.bounce2}
        src={"/beldum-loading.png"}
        alt=""
        width={64}
        height={64} />
      <Image className={styles.bounce3}
        src={"/beldum-loading.png"}
        alt=""
        width={64}
        height={64} />
    </div>
  </div>
}

