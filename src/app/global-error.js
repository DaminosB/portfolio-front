"use client";

export default function GlobalError({ error, reset }) {
  return (
    <html>
      <body>
        <div className="error-component">
          <h2>Something went wrong!</h2>
          <button onClick={() => reset()}>Try again</button>
        </div>
      </body>
    </html>
  );
}
