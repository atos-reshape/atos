export type COLORS =
  | 'red'
  | 'pink'
  | 'grape'
  | 'violet'
  | 'indigo'
  | 'blue'
  | 'cyan'
  | 'green'
  | 'lime'
  | 'yellow'
  | 'orange';

const ALL_COLORS: COLORS[] = [
  'red',
  'pink',
  'grape',
  'violet',
  'indigo',
  'blue',
  'cyan',
  'green',
  'lime',
  'yellow',
  'orange'
];

export function usePlayerColors() {
  const findColor = (id: string): COLORS => {
    const color = localStorage.getItem(`color: ${id}`) as COLORS | undefined;
    if (!!color) return color;

    const newColor = ALL_COLORS[Math.floor(Math.random() * ALL_COLORS.length)];
    localStorage.setItem(`color: ${id}`, newColor);

    return newColor;
  };

  return { findColor };
}
