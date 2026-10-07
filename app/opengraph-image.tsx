import { ImageResponse } from 'next/og';
export const alt = 'Veehoster — A better home for your digital world';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        background: '#eeedff',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: '65px 80px',
        fontFamily: 'sans-serif',
        color: '#171c34',
      }}
    >
      <div style={{ display: 'flex', fontSize: 39, fontWeight: 800, letterSpacing: -2 }}>
        veehoster<span style={{ color: '#635bff' }}>.</span>
      </div>
      <div
        style={{
          display: 'flex',
          fontSize: 76,
          fontWeight: 800,
          letterSpacing: -4,
          lineHeight: 1.1,
          marginTop: 80,
        }}
      >
        A better home for
        <br />
        your digital world.
      </div>
      <div style={{ display: 'flex', fontSize: 23, marginTop: 43, color: '#71698d' }}>
        Hosting · Websites · Domains · SEO
      </div>
      <div
        style={{
          position: 'absolute',
          right: 55,
          bottom: 55,
          display: 'flex',
          width: 180,
          height: 180,
          borderRadius: 100,
          background: '#635bff',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: 130,
          fontWeight: 800,
          letterSpacing: -16,
          paddingRight: 15,
        }}
      >
        v.
      </div>
    </div>,
    size,
  );
}
