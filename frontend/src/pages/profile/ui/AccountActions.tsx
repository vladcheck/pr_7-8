import Button from "@/shared/ui/Button";
import FlexContainer from "@/shared/ui/FlexContainer";

export default function AccountActions({
  onLogOut,
  onDeleteAccount,
}: {
  onLogOut: () => void;
  onDeleteAccount: () => void;
}) {
  return (
    <FlexContainer className="gap-10">
      <Button onClick={onLogOut}>Выйти</Button>
      <Button onClick={onDeleteAccount} className="bg-red-400">
        Удалить аккаунт
      </Button>
    </FlexContainer>
  );
}
