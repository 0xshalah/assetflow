'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        level: 'error',
        message: 'Global unhandled error',
        context: { errorMessage: error.message, digest: error.digest }
      })
    );
  }, [error]);

  return (
    <html lang='en'>
      <body
        style={{
          margin: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          fontFamily: 'Geist, system-ui, sans-serif',
          backgroundColor: '#fafafa',
          color: '#09090b'
        }}
      >
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600, letterSpacing: '-0.025em' }}>
            Terjadi Kesalahan
          </h1>
          <p style={{ color: '#71717a', marginTop: '0.5rem', fontSize: '0.875rem' }}>
            Aplikasi mengalami error yang tidak terduga.
          </p>
          {error.digest && (
            <p
              style={{
                color: '#a1a1aa',
                marginTop: '0.5rem',
                fontSize: '0.75rem',
                fontFamily: 'monospace'
              }}
            >
              ID: {error.digest}
            </p>
          )}
          <button
            onClick={reset}
            style={{
              marginTop: '1.5rem',
              padding: '0.625rem 1.5rem',
              backgroundColor: '#09090b',
              color: '#fafafa',
              border: 'none',
              borderRadius: '9999px',
              fontSize: '0.8125rem',
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            Muat Ulang
          </button>
        </div>
      </body>
    </html>
  );
}
