import { ImageResponse } from "next/og";

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
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "54px",
          background:
            "linear-gradient(135deg, rgba(255,250,243,1) 0%, rgba(255,241,230,1) 45%, rgba(236,255,247,1) 100%)",
          color: "#25413a",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            fontSize: 28,
            fontWeight: 800,
            color: "#c7664d",
          }}
        >
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: 999,
              background: "#ff7f66",
              boxShadow: "0 0 0 12px rgba(255, 127, 102, 0.18)",
            }}
          />
          Superpen
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", gap: "32px" }}>
          <div style={{ display: "flex", flexDirection: "column", maxWidth: 700 }}>
            <div
              style={{
                fontSize: 78,
                lineHeight: 1,
                fontWeight: 800,
                letterSpacing: "-0.05em",
              }}
            >
              A friendly digital whiteboard for math.
            </div>
            <div
              style={{
                marginTop: 24,
                fontSize: 30,
                lineHeight: 1.4,
                color: "#5f756e",
              }}
            >
              Live drawing, easy annotation, and a calm classroom-ready UI for
              teachers and students.
            </div>
          </div>

          <div
            style={{
              width: 340,
              height: 230,
              borderRadius: 28,
              border: "1px solid rgba(37, 65, 58, 0.1)",
              background: "rgba(255,255,255,0.82)",
              boxShadow: "0 20px 40px rgba(95, 80, 43, 0.12)",
              padding: 24,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 22,
                color: "#617770",
              }}
            >
              <span>Lesson mode</span>
              <span>y = x^2 - 4x + 3</span>
            </div>
            <svg width="292" height="126" viewBox="0 0 292 126" fill="none">
              <line x1="20" y1="110" x2="270" y2="110" stroke="#9aadab" strokeWidth="4" />
              <line x1="52" y1="14" x2="52" y2="116" stroke="#9aadab" strokeWidth="4" />
              <path
                d="M22 103 C65 89, 92 48, 132 42 S208 84, 270 58"
                stroke="#ff7f66"
                strokeWidth="8"
                strokeLinecap="round"
              />
              <circle cx="208" cy="62" r="16" stroke="#ff7f66" strokeWidth="6" fill="white" />
            </svg>
            <div
              style={{
                display: "flex",
                gap: 10,
                color: "#617770",
                fontSize: 18,
                fontWeight: 700,
              }}
            >
              <span
                style={{
                  background: "rgba(255, 207, 191, 0.56)",
                  borderRadius: 999,
                  padding: "8px 14px",
                }}
              >
                Pen
              </span>
              <span
                style={{
                  background: "rgba(114, 213, 183, 0.22)",
                  borderRadius: 999,
                  padding: "8px 14px",
                }}
              >
                Highlight
              </span>
            </div>
          </div>
        </div>
      </div>
    ),
    size
  );
}
