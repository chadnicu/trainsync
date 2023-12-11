import { ImageResponse } from "next/og";
import Page from "./page";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(<Page />, {
    width: 1200,
    height: 600,
  });
}
