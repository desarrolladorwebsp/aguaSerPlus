import { ImageResponse } from "next/og";

export const alt =
  "Agua Ser Plus: agua purificada, dispensadores y despacho a domicilio";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #003e75 0%, #0056a3 56%, #0099dd 100%)",
          color: "white",
          display: "flex",
          height: "100%",
          position: "relative",
          width: "100%",
        }}
      >
        <div
          style={{
            background: "rgba(255,255,255,0.1)",
            borderRadius: "50%",
            display: "flex",
            height: 560,
            position: "absolute",
            right: -150,
            top: -210,
            width: 560,
          }}
        />
        <div
          style={{
            background: "rgba(255,255,255,0.08)",
            borderRadius: "50%",
            bottom: -230,
            display: "flex",
            height: 510,
            left: 590,
            position: "absolute",
            width: 510,
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "66px 78px",
            width: "100%",
          }}
        >
          <div style={{ alignItems: "center", display: "flex" }}>
            <div
              style={{
                alignItems: "center",
                background: "white",
                borderRadius: 20,
                color: "#0056a3",
                display: "flex",
                fontSize: 42,
                fontWeight: 800,
                height: 78,
                justifyContent: "center",
                width: 78,
              }}
            >
              A
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 37,
                fontWeight: 700,
                marginLeft: 22,
              }}
            >
              AGUA SER PLUS
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", maxWidth: 800 }}>
            <div style={{ display: "flex", fontSize: 76, fontWeight: 800, lineHeight: 1.05 }}>
              Agua pura para tu hogar y oficina
            </div>
            <div style={{ display: "flex", fontSize: 32, marginTop: 28, opacity: 0.95 }}>
              Bidones, dispensadores y despacho a domicilio en Santiago.
            </div>
          </div>

          <div style={{ alignItems: "center", display: "flex", fontSize: 26, fontWeight: 600 }}>
            <div
              style={{
                background: "#1fa97a",
                borderRadius: 999,
                display: "flex",
                height: 18,
                marginRight: 14,
                width: 18,
              }}
            />
            Salud, economía y reciclaje
          </div>
        </div>
      </div>
    ),
    size,
  );
}