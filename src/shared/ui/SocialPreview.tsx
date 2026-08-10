export const SOCIAL_IMAGE_SIZE = {
  width: 1200,
  height: 630
};

export function SocialPreview() {
  return (
    <div
      style={{
        alignItems: "stretch",
        background: "#020202",
        color: "#f7f7f1",
        display: "flex",
        fontFamily: "Arial, sans-serif",
        height: "100%",
        padding: 52,
        width: "100%"
      }}
    >
      <div
        style={{
          border: "1px solid rgba(238, 187, 70, 0.42)",
          display: "flex",
          flex: 1,
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "54px 62px",
          position: "relative"
        }}
      >
        <div
          style={{
            background: "#EEBB46",
            height: 8,
            left: 0,
            position: "absolute",
            top: 0,
            width: 210
          }}
        />
        <div style={{ color: "#EEBB46", display: "flex", fontSize: 30, letterSpacing: 3 }}>
          RICKSON.DEV
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", fontSize: 76, fontWeight: 700, letterSpacing: -3 }}>
            Rickson de Oliveira
          </div>
          <div style={{ color: "#b9bfbc", display: "flex", fontSize: 31 }}>
            Desenvolvedor de software · Sistemas sob medida
          </div>
        </div>
        <div style={{ alignItems: "center", display: "flex", gap: 14 }}>
          <div style={{ background: "#EEBB46", borderRadius: 999, height: 12, width: 12 }} />
          <div style={{ color: "#d8d9d1", display: "flex", fontSize: 24 }}>
            Tecnologia que organiza operações e reduz trabalho manual.
          </div>
        </div>
      </div>
    </div>
  );
}
