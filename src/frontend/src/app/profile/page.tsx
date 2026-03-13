import { useEffect } from "react";
import useApi from "../../features/api/useApi";
import { useNavigate } from "react-router";
import FlexContainer from "../../shared/ui/FlexContainer";
import Button from "../../shared/ui/Button";

export default function ProfilePage() {
  const navigate = useNavigate();
  const api = useApi();

  useEffect(() => {
    api.isLoggedIn().then((isLoggedIn) => {
      if (!isLoggedIn) {
        navigate("/login");
      }
    });
  });

  const onLogOut = () => {};

  const onDeleteAccount = () => {};

  return (
    <div>
      <h1 className="text-3xl">Ваш профиль</h1>
      <FlexContainer flexDir="col" className="gap-4">
        <div>
          <h6>Имя</h6>
          <span></span>
        </div>
        <div>
          <h6>Фамилия</h6>
          <span></span>
        </div>
        <div>
          <h6>Почта</h6>
          <span></span>
        </div>
        <FlexContainer>
          <Button onClick={onLogOut}>Выйти</Button>
          <Button onClick={onDeleteAccount} className="bg-red-400">
            Удалить аккаунт
          </Button>
        </FlexContainer>
      </FlexContainer>
    </div>
  );
}
