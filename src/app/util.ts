


export function percent(n: number): string {
  return (n * 100).toFixed(2) + '%';
}
/**
 * Concatenate class names separated by a space
 */
export function conc(...classNames: string[]) {
  return classNames.join(' ');
}
