export function diceValuesText(dice: { value: number }[]): string {
  return dice.map((die) => die.value).join("-");
}
