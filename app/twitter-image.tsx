import { ImageResponse } from "next/og";
import { HomePagePreview } from "./opengraph-image";

export const runtime = "edge";

export const size = {
  width: 1200,
  height: 630,
};

export const alt = "TrainSync Homepage";
export const contentType = "image/png";

export default async function Image() {
  const fontData = await fetch(
    new URL("../public/Inter-Bold.ttf", import.meta.url)
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(<HomePagePreview />, {
    ...size,
    fonts: [
      {
        name: "Inter-Bold",
        data: fontData,
        style: "normal",
      },
    ],
  });
}
