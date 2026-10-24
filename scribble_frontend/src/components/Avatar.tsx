export type Cell = { col: number; row: number };

export type AvatarConfig = {
  color: Cell;
  eyes: Cell;
  mouth: Cell;
  owner?: boolean;
};

export const ATLAS = {
  color: { src: "/img/avatar/color_atlas.gif", cols: 10, rows: 3 },
  eyes: { src: "/img/avatar/eyes_atlas.gif", cols: 10, rows: 6 },
  mouth: { src: "/img/avatar/mouth_atlas.gif", cols: 10, rows: 6 },
} as const;

// Random cell from an atlas, different from the current one
export function randomCell(layer: "eyes" | "mouth", current: Cell): Cell {
  const { cols, rows } = ATLAS[layer];
  let next: Cell;
  do {
    next = {
      col: Math.floor(Math.random() * cols),
      row: Math.floor(Math.random() * rows),
    };
  } while (next.col === current.col && next.row === current.row);
  return next;
}

function Layer({
  layer,
  cell,
  size,
}: {
  layer: keyof typeof ATLAS;
  cell: Cell;
  size: number;
}) {
  const a = ATLAS[layer];
  return (
    <div
      className="absolute inset-0 bg-no-repeat [image-rendering:pixelated]"
      style={{
        backgroundImage: `url(${a.src})`,
        backgroundSize: `${a.cols * 100}% auto`, // width only, height follows the image
        backgroundPosition: `${-cell.col * size}px ${-cell.row * size}px`,
      }}
    />
  );
}

export default function Avatar({
  config,
  size = 64,
}: {
  config: AvatarConfig;
  size?: number;
}) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <Layer layer="color" cell={config.color} size={size} />
      <Layer layer="eyes" cell={config.eyes} size={size} />
      <Layer layer="mouth" cell={config.mouth} size={size} />
      {config.owner && (
        <div
          className="absolute -top-3 left-0 h-1/2 w-1/2 -rotate-12 bg-contain bg-no-repeat [image-rendering:pixelated]"
          style={{ backgroundImage: "url(/img/crown.gif)" }}
        />
      )}
    </div>
  );
}