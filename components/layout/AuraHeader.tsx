export function AuraHeader() {
  return (
    <header className="sticky top-0 z-50 bg-spotify-black/97 backdrop-blur-xl px-4 pt-3 pb-2.5 shadow-[0_1px_0_rgba(255,255,255,0.04)]">
      <div className="max-w-md mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-spotify-green/12">
            <svg width="20" height="20" viewBox="0 0 24 24" className="text-spotify-green">
              <path
                fill="currentColor"
                d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"
              />
            </svg>
          </div>
          <div className="flex flex-col gap-0.5 min-w-0">
            <h1 className="text-[16px] font-bold tracking-tight text-white leading-none">
              Spotify Aura
            </h1>
            <p className="text-[11px] font-medium leading-none text-white/70">
              AI-Powered Contextual Music Discovery Companion
            </p>
          </div>
        </div>
        <button
          type="button"
          aria-label="Profile"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-spotify-elevated ring-1 ring-white/[0.06] transition-transform active:scale-95"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-spotify-text-secondary"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </button>
      </div>
      <div className="max-w-md mx-auto mt-2.5 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
    </header>
  );
}
