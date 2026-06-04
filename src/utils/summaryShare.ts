export type SummaryShareTile = {
  label: string;
  value: number | string;
};

type SummaryImageOptions = {
  gameUrl: string;
  resultText: string;
  tiles: SummaryShareTile[];
  title: string;
};

type DownloadSummaryImageOptions = SummaryImageOptions & {
  fileName?: string;
};

type ShareSummaryTextOptions = {
  gameUrl: string;
  resultText: string;
  tiles: SummaryShareTile[];
  title: string;
};

function drawRoundRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.lineTo(x + width - radius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + radius);
  context.lineTo(x + width, y + height - radius);
  context.quadraticCurveTo(
    x + width,
    y + height,
    x + width - radius,
    y + height,
  );
  context.lineTo(x + radius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - radius);
  context.lineTo(x, y + radius);
  context.quadraticCurveTo(x, y, x + radius, y);
  context.closePath();
}

function canvasToBlob(canvas: HTMLCanvasElement) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
        return;
      }

      reject(new Error("Could not create summary image."));
    }, "image/png");
  });
}

async function createSummaryImage({
  gameUrl,
  resultText,
  tiles,
  title,
}: SummaryImageOptions) {
  const scale = 2;
  const width = 720;
  const tileWidth = 288;
  const tileHeight = 112;
  const gap = 24;
  const rows = Math.ceil(tiles.length / 2);
  const tilesTop = 258;
  const tilesBottom = tilesTop + rows * tileHeight + (rows - 1) * gap;
  const footerTop = tilesBottom + 48;
  const height = footerTop + 100;
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Could not create summary image.");
  }

  canvas.width = width * scale;
  canvas.height = height * scale;
  context.scale(scale, scale);

  context.fillStyle = "#18181b";
  context.fillRect(0, 0, width, height);

  context.fillStyle = "#27272a";
  drawRoundRect(context, 32, 32, width - 64, height - 64, 24);
  context.fill();

  context.fillStyle = "#a855f7";
  drawRoundRect(context, 56, 56, 64, 64, 14);
  context.fill();

  context.fillStyle = "#ffffff";
  context.font = "900 38px system-ui, -apple-system, Segoe UI, sans-serif";
  context.fillText("VelociDice", 136, 96);

  context.fillStyle = "#ffffff";
  context.font = "900 48px system-ui, -apple-system, Segoe UI, sans-serif";
  context.fillText(title, 56, 178);

  context.fillStyle = "#a1a1aa";
  context.font = "700 22px system-ui, -apple-system, Segoe UI, sans-serif";
  context.fillText(resultText, 56, 216);

  tiles.forEach(({ label, value }, index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const x = 56 + col * (tileWidth + gap);
    const y = tilesTop + row * (tileHeight + gap);

    context.fillStyle = "#18181b";
    drawRoundRect(context, x, y, tileWidth, tileHeight, 14);
    context.fill();

    context.strokeStyle = "#3f3f46";
    context.lineWidth = 2;
    drawRoundRect(context, x, y, tileWidth, tileHeight, 14);
    context.stroke();

    context.fillStyle = "#a1a1aa";
    context.font = "800 18px system-ui, -apple-system, Segoe UI, sans-serif";
    context.fillText(label.toUpperCase(), x + 20, y + 38);

    context.fillStyle = "#ffffff";
    context.font = "900 34px system-ui, -apple-system, Segoe UI, sans-serif";
    context.fillText(String(value), x + 20, y + 82);
  });

  context.fillStyle = "#a1a1aa";
  context.font = "800 20px system-ui, -apple-system, Segoe UI, sans-serif";
  context.fillText("Play at", 56, footerTop);

  context.fillStyle = "#ffffff";
  context.font = "900 24px system-ui, -apple-system, Segoe UI, sans-serif";
  context.fillText(gameUrl, 56, footerTop + 32);

  return canvasToBlob(canvas);
}

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

function formatSummaryText({
  gameUrl,
  resultText,
  tiles,
  title,
}: ShareSummaryTextOptions) {
  const tileText = tiles.map(({ label, value }) => `${label}: ${value}`);

  return [`VelociDice - ${title}`, resultText, ...tileText, `Play: ${gameUrl}`]
    .filter(Boolean)
    .join("\n");
}

export async function shareSummaryText(options: ShareSummaryTextOptions) {
  const text = formatSummaryText(options);
  const shareData = {
    text,
    title: "VelociDice summary",
  };

  if (navigator.share) {
    await navigator.share(shareData);
    return;
  }

  await navigator.clipboard.writeText(text);
}

export async function downloadSummaryImage({
  fileName = "velocidice-summary.png",
  gameUrl,
  resultText,
  tiles,
  title,
}: DownloadSummaryImageOptions) {
  const blob = await createSummaryImage({
    gameUrl,
    resultText,
    tiles,
    title,
  });

  downloadBlob(blob, fileName);
}
