import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const locale = searchParams.get('locale') ?? 'en'

  const title =
    locale === 'es'
      ? 'Senior Fullstack Engineer'
      : 'Senior Fullstack Engineer'

  const subtitle =
    locale === 'es'
      ? '14+ años · React · TypeScript · Node.js · IA'
      : '14+ years · React · TypeScript · Node.js · AI'

  const available = locale === 'es' ? 'Disponible para nuevos retos' : 'Open to opportunities'

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px',
          background: '#0a0a0a',
          fontFamily: 'monospace',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: 'absolute',
            top: '-120px',
            right: '-120px',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-80px',
            left: '-80px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)',
          }}
        />

        {/* Top: domain */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ color: '#3b82f6', fontSize: '16px', letterSpacing: '0.2em' }}>
            dniskav.com
          </span>
        </div>

        {/* Middle: name + title */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '6px',
                height: '56px',
                background: '#3b82f6',
                borderRadius: '3px',
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ color: '#ffffff', fontSize: '56px', fontWeight: 700, lineHeight: 1 }}>
                Daniel Silva
              </span>
              <span style={{ color: '#a1a1aa', fontSize: '24px' }}>{title}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '8px', paddingLeft: '22px' }}>
            {subtitle.split(' · ').map((tag) => (
              <span
                key={tag}
                style={{
                  background: 'rgba(59,130,246,0.1)',
                  border: '1px solid rgba(59,130,246,0.3)',
                  color: '#93c5fd',
                  padding: '6px 14px',
                  borderRadius: '6px',
                  fontSize: '14px',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom: available badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '22px' }}>
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#22c55e',
            }}
          />
          <span style={{ color: '#71717a', fontSize: '15px' }}>{available}</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  )
}
