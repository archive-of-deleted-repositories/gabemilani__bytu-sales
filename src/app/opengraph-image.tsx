import { ImageResponse } from "next/og";

export const alt = "BYTU — Gestão para escolas de kitesurf";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Branded social share card (espresso background, creme/sand text) matching the
 * BYTU "Paleta natural". Text-based so it renders fast and stays crisp.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#3e2e1f",
          color: "#f2ede6",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            letterSpacing: "0.05em",
            color: "#f2ede6",
          }}
        >
          BYTU
        </div>
        <div style={{ fontSize: 46, fontWeight: 600, marginTop: 24, maxWidth: 900 }}>
          Gestão completa para a sua escola de kitesurf
        </div>
        <div style={{ fontSize: 30, color: "#c7b59a", marginTop: 28 }}>
          Beta aberto para escolas movidas pelo vento · bytu.com.br
        </div>
      </div>
    ),
    { ...size },
  );
}
