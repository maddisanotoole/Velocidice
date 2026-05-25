import Button from "./GameButton";

type RulesButtonProps = {
  onClick: () => void;
};

export function RulesButton({ onClick }: RulesButtonProps) {
  return (
    <Button onClick={onClick} color="blue">
      Rules
    </Button>
  );
}
