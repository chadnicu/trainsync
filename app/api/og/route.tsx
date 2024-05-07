import { ImageResponse } from "next/og";
// App router includes @vercel/og.
// No need to install it.

export async function GET() {
  const fontData = await fetch(
    new URL("../../../public/fonts/Geist-Bold.ttf", import.meta.url)
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          letterSpacing: "-.02em",
          fontWeight: 700,
          background: "#09090B",
          fontFamily: '"Geist"',
        }}
      >
        <div
          style={{
            left: 42,
            top: 42,
            position: "absolute",
            display: "flex",
            alignItems: "center",
          }}
        >
          <span
            style={{
              width: 24,
              height: 24,
              background: "white",
            }}
          />
          <span
            style={{
              marginLeft: 8,
              fontSize: 20,
              color: "grey",
            }}
          >
            trainsync.online
          </span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px 50px",
            margin: "0 42px",
            fontSize: 120,
            width: "auto",
            maxWidth: 700,
            textAlign: "center",
            lineHeight: 1.4,
            backgroundImage: "linear-gradient(to bottom, #fafafa, #3f3f46)",
            letterSpacing: "-4",
            color: "transparent",
            backgroundClip: "text",
          }}
        >
          TrainSync
          <div style={{ color: "white", fontSize: 40, letterSpacing: "" }}>
            Exercises
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Geist",
          data: fontData,
          style: "normal",
        },
      ],
    }
  );
}
