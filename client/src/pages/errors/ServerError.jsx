export default function ServerError() {
  return (
    <div className="grid min-h-screen place-items-center p-8 text-center">
      <div>
        <h1 className="text-2xl font-semibold">YatraGenie couldn't load this right now.</h1>
        <button type="button" className="mt-4 text-accent-cyan" onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    </div>
  );
}
