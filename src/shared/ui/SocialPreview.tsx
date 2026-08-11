export const SOCIAL_IMAGE_SIZE = {
  width: 1200,
  height: 630
};

type SocialPreviewProps = {
  logoSrc: string;
};

export function SocialPreview({ logoSrc }: SocialPreviewProps) {
  return (
    <div
      style={{
        alignItems: "stretch",
        background: "linear-gradient(135deg, #050606 0%, #10171a 52%, #050606 100%)",
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
          border: "1px solid rgba(238, 187, 70, 0.36)",
          display: "flex",
          flex: 1,
          flexDirection: "column",
          justifyContent: "space-between",
          overflow: "hidden",
          padding: "46px 58px 42px",
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

        <div
          style={{
            background: "rgba(56, 74, 85, 0.18)",
            height: 1,
            left: 0,
            position: "absolute",
            top: 172,
            width: "100%"
          }}
        />
        <div
          style={{
            background: "rgba(56, 74, 85, 0.14)",
            height: 1,
            left: 0,
            position: "absolute",
            top: 352,
            width: "100%"
          }}
        />
        <div
          style={{
            background: "rgba(56, 74, 85, 0.16)",
            height: "100%",
            left: 365,
            position: "absolute",
            top: 0,
            width: 1
          }}
        />
        <div
          style={{
            background: "rgba(56, 74, 85, 0.12)",
            height: "100%",
            left: 728,
            position: "absolute",
            top: 0,
            width: 1
          }}
        />

        <div
          style={{
            alignItems: "center",
            display: "flex",
            width: "100%"
          }}
        >
          <div
            style={{
              color: "#EEBB46",
              display: "flex",
              fontSize: 22,
              letterSpacing: 2
            }}
          >
            RICKSON.DEV
          </div>
        </div>

        <div
          style={{
            border: "1px solid rgba(56, 74, 85, 0.42)",
            borderRadius: 999,
            display: "flex",
            height: 430,
            left: 332,
            position: "absolute",
            top: 43,
            width: 430
          }}
        />
        <div
          style={{
            border: "1px solid rgba(238, 187, 70, 0.48)",
            display: "flex",
            height: 330,
            left: 382,
            position: "absolute",
            top: 93,
            transform: "rotate(45deg)",
            width: 330
          }}
        />
        <div
          style={{
            background: "rgba(17, 27, 32, 0.86)",
            border: "1px solid rgba(113, 135, 145, 0.66)",
            display: "flex",
            height: 250,
            left: 422,
            position: "absolute",
            top: 133,
            transform: "rotate(45deg)",
            width: 250
          }}
        />
        <div
          style={{
            border: "1px solid rgba(238, 187, 70, 0.2)",
            display: "flex",
            height: 192,
            left: 451,
            position: "absolute",
            top: 162,
            transform: "rotate(45deg)",
            width: 192
          }}
        />

        <div
          style={{
            background: "#EEBB46",
            height: 8,
            left: 543,
            position: "absolute",
            top: 75,
            transform: "rotate(45deg)",
            width: 8
          }}
        />
        <div
          style={{
            background: "#718791",
            height: 7,
            left: 748,
            position: "absolute",
            top: 251,
            transform: "rotate(45deg)",
            width: 7
          }}
        />
        <div
          style={{
            background: "#D1A13A",
            height: 7,
            left: 338,
            position: "absolute",
            top: 251,
            transform: "rotate(45deg)",
            width: 7
          }}
        />

        <div
          style={{
            background: "rgba(238, 187, 70, 0.6)",
            height: 1,
            left: 266,
            position: "absolute",
            top: 122,
            transform: "rotate(-32deg)",
            width: 104
          }}
        />
        <div
          style={{
            background: "rgba(113, 135, 145, 0.64)",
            height: 1,
            left: 722,
            position: "absolute",
            top: 395,
            transform: "rotate(-32deg)",
            width: 112
          }}
        />

        {/* Satori supports data URLs for images rendered inside ImageResponse. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt=""
          height={254}
          src={logoSrc}
          style={{
            left: 363,
            objectFit: "contain",
            position: "absolute",
            top: 131
          }}
          width={360}
        />

        <div
          style={{
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
            gap: 9,
            width: "100%"
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 48,
              fontWeight: 700,
              letterSpacing: -1.5
            }}
          >
            Rickson de Oliveira
          </div>
          <div
            style={{
              alignItems: "center",
              color: "#b9bfbc",
              display: "flex",
              fontSize: 23
            }}
          >
            Desenvolvedor de software
          </div>
        </div>
      </div>
    </div>
  );
}
