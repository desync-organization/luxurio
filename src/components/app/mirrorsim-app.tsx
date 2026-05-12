"use client";

import { NumberTicker } from "@/components/magicui/number-ticker";
import { Separator } from "@/components/ui/separator";

export function MirrorSimApp() {
  return (
    <main className="flex min-h-screen w-full flex-col">
      <header className="flex h-14 items-center justify-between border-b border-foreground/30 px-4">
        <h1 className="text-sm font-semibold tracking-[0.2em] uppercase">MirrorSim</h1>
        <p className="text-xs tracking-wide uppercase text-foreground/80">Placeholder UI</p>
      </header>

      <div className="flex flex-1">
        <aside className="flex w-[22rem] flex-col border-r border-foreground/30">
          <section className="space-y-2 p-4">
            <h2 className="text-xs tracking-wide uppercase">Image Upload</h2>
            <div className="rounded-md border border-foreground/30 p-4">
              <p className="text-xs text-foreground/80">Upload panel placeholder</p>
            </div>
          </section>

          <Separator />

          <section className="space-y-2 p-4">
            <h2 className="text-xs tracking-wide uppercase">Background Removal</h2>
            <div className="rounded-md border border-foreground/30 p-4">
              <p className="text-xs text-foreground/80">Processing panel placeholder</p>
            </div>
          </section>

          <Separator />

          <section className="space-y-2 p-4">
            <h2 className="text-xs tracking-wide uppercase">Status</h2>
            <div className="flex items-center justify-between rounded-md border border-foreground/30 px-3 py-2 text-xs">
              <span className="uppercase">Uploads</span>
              <NumberTicker value={0} />
            </div>
          </section>
        </aside>

        <section className="flex flex-1 p-4">
          <div className="flex w-full items-center justify-center rounded-md border border-foreground/30 text-xs tracking-wide uppercase text-foreground/80">
            3D viewport placeholder
          </div>
        </section>
      </div>
    </main>
  );
}
