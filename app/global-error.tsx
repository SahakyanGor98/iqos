'use client';

import { useEffect } from 'react';

// Last-resort boundary for errors thrown in the root layout itself. It replaces
// the whole document, so it renders its own <html>/<body> and uses inline styles
// (the app stylesheet from the layout is not guaranteed to be present here).
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang='ru'>
      <body
        style={{
          margin: 0,
          minHeight: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '2rem',
          fontFamily: 'Arial, Helvetica, sans-serif',
          background: '#fffdfb',
          color: '#34303d',
        }}
      >
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, textTransform: 'uppercase', margin: 0 }}>
          Что-то пошло не так
        </h1>
        <p style={{ marginTop: '0.75rem', maxWidth: '28rem', color: '#6b7280', lineHeight: 1.6 }}>
          Произошла критическая ошибка. Пожалуйста, попробуйте перезагрузить страницу.
        </p>
        <button
          onClick={reset}
          style={{
            marginTop: '2rem',
            padding: '0.75rem 2rem',
            borderRadius: '9999px',
            border: 'none',
            cursor: 'pointer',
            background: '#34303d',
            color: '#ffffff',
            fontSize: '0.875rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}
        >
          Перезагрузить
        </button>
      </body>
    </html>
  );
}
