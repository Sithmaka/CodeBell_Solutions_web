export default function RouteLoader() {
  return (
    <main className="cb-loading-shell" role="status" aria-live="polite">
      <div className="cb-loading-field" aria-hidden="true">
        {Array.from({ length: 18 }, (_, index) => (
          <span key={index} style={{ "--index": index }} />
        ))}
      </div>
      <div className="cb-loading-core" aria-hidden="true">
        <i />
        <i />
        <i />
        <b>CB</b>
      </div>
      <p>Loading CodeBell</p>
    </main>
  );
}
