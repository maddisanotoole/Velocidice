import Button from "./GameButton";

type RulesButtonProps = {
  onClick: () => void;
  size?: "normal" | "small";
};

export function RulesButton({ onClick, size = "normal" }: RulesButtonProps) {
  return (
    <Button onClick={onClick} color="blue" size={size}>
      Rules
    </Button>
  );
}
