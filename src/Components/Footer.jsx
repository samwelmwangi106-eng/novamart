export function Footer() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-black/40 py-10 mt-16">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <p className="font-black tracking-tight text-lg">
          <span className="text-amber-500">NOVA</span>MART
        </p>
        <p className="text-xs text-zinc-500 mt-2">
          Hardware, audio and everyday gear. © {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
