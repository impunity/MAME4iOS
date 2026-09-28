export function SiteHeader() {
  return (
    <header className="flex flex-col gap-4">
      <p className="text-xs uppercase tracking-[0.3em] text-accent">MAME4iOS Cloud</p>
      <h1 className="font-display text-2xl leading-relaxed text-balance text-primary md:text-4xl">
        Robotron: 2084
        <span className="block text-foreground">High Scores</span>
      </h1>
      <p className="max-w-2xl text-sm leading-relaxed text-muted text-pretty">
        Save the last human family. Scores from MAME4iOS players on iPhone, iPad, Apple TV and Mac, all ranked
        in one global table.
      </p>
    </header>
  )
}
