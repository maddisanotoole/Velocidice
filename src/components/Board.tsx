type BoardProps = {
  children: React.ReactNode;
};

export function Board({ children }: BoardProps) {
  return (
    <div
      className="
        flex
        flex-col
        gap-8
        bg-zinc-800
        rounded-2xl
        px-8
        py-6
        shadow-xl
        "
    >
      {children}
    </div>
  );
}
