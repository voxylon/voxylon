import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  try {
    const { searchParams } = new URL(req.url);
    
    const title = searchParams.get('title') || 'Voxylon';
    const subtitle = searchParams.get('subtitle') || 'Radically fair.';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#000',
            backgroundImage: 'linear-gradient(to bottom right, #1a1a1a, #000)',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '40px 80px',
            }}
          >
            <h1
              style={{
                fontSize: 80,
                fontWeight: 'bold',
                background: 'linear-gradient(to right, #60a5fa, #a78bfa)',
                backgroundClip: 'text',
                color: 'transparent',
                margin: 0,
                padding: 0,
                textAlign: 'center',
              }}
            >
              {title}
            </h1>
            <p
              style={{
                fontSize: 40,
                color: '#9ca3af',
                marginTop: 20,
                textAlign: 'center',
              }}
            >
              {subtitle}
            </p>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    console.log(e.message);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
