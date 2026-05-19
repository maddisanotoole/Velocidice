type RowProps = {
  children: React.ReactNode;
};

export function Row({ children }: RowProps) {
  return (
    <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
      {children}
    </div>
  );
}
