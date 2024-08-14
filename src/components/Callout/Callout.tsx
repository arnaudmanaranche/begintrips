export function Callout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-warning-light p-4 rounded-lg">
      <p className="text-sm text-black">{children}</p>
    </div>
  );
}
