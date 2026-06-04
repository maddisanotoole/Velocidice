import Button from "./GameButton";

type NewGameButtonProps = {
  label: string;
  onClick: () => void;
  size?: "normal" | "small";
};

export function NewGameButton({
  label,
  onClick,
  size = "normal",
}: NewGameButtonProps) {
  return (
    <Button onClick={onClick} color="green" size={size}>
      {label}
    </Button>
  );
}
