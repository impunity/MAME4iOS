const postExample = `curl -X POST https://<your-domain>/api/scores \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer $HIGHSCORE_API_KEY" \\
  -d '{"initials":"TDL","score":127450,"wave":14,"platform":"ios"}'`

const getExample = `curl "https://<your-domain>/api/scores?game=robotron&limit=10"`

const fields = [
  ['initials', 'string, required', '1-3 chars, A-Z 0-9'],
  ['score', 'integer, required', '0 to 99,999,999'],
  ['wave', 'integer, optional', 'Wave reached'],
  ['game', 'string, optional', 'MAME romset, defaults to robotron'],
  ['platform', 'string, optional', 'ios, tvos, macos or other'],
  ['deviceId', 'string, optional', 'Opaque per-install id, never shown publicly'],
]

export function ApiDocs() {
  return (
    <section aria-labelledby="api-title" className="flex flex-col gap-5 rounded-md border border-border bg-surface p-5">
      <div className="flex flex-col gap-2">
        <h2 id="api-title" className="font-display text-xs text-accent">
          Submit from MAME4iOS
        </h2>
        <p className="text-sm leading-relaxed text-muted">
          The app posts a JSON score when a Robotron game ends. The response includes the saved entry and its global
          rank. If <code className="text-foreground">HIGHSCORE_API_KEY</code> is set on the server, requests must send
          it as a bearer token.
        </p>
      </div>
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <h3 className="text-xs uppercase tracking-widest text-muted">POST /api/scores</h3>
          <pre className="overflow-x-auto rounded border border-border bg-background p-3 text-xs leading-relaxed text-foreground">
            <code>{postExample}</code>
          </pre>
          <h3 className="mt-2 text-xs uppercase tracking-widest text-muted">GET /api/scores</h3>
          <pre className="overflow-x-auto rounded border border-border bg-background p-3 text-xs leading-relaxed text-foreground">
            <code>{getExample}</code>
          </pre>
        </div>
        <div className="lg:w-80">
          <h3 className="mb-2 text-xs uppercase tracking-widest text-muted">Body fields</h3>
          <dl className="flex flex-col gap-2 text-xs">
            {fields.map(([name, type, note]) => (
              <div key={name} className="flex flex-col gap-0.5 border-t border-border pt-2">
                <dt className="text-primary">
                  {name} <span className="text-muted">{type}</span>
                </dt>
                <dd className="text-muted">{note}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
