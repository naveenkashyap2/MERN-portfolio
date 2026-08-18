import Logo from '../common/Logo.jsx';

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-bg-secondary lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.25),transparent_40%),radial-gradient(circle_at_80%_70%,rgba(6,182,212,0.2),transparent_35%)]" />
        <div className="relative flex h-full flex-col justify-between p-10">
          <Logo />
          <div>
            <p className="text-4xl font-semibold leading-tight">Your Journey.<br />Planned by AI.</p>
            <p className="mt-4 max-w-sm text-ink-mute">Intelligent India trips — itineraries, routes, stays and budgets. Live data only when verified.</p>
          </div>
          <p className="text-xs text-ink-mute">YatraGenie AI</p>
        </div>
      </div>
      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>
          <h1 className="text-2xl font-semibold">{title}</h1>
          <p className="mt-2 text-sm text-ink-mute">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
