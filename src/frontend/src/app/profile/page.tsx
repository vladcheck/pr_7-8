import { useEffect, useState } from "react";
import useApi from "../../features/api/useApi";
import { useNavigate } from "react-router";
import User from "../../entities/User";
import UserInfoCard from "./ui/UserInfoCard";
import AccountActions from "./ui/AccountActions";
import FlexContainer from "../../shared/ui/FlexContainer";
import useNotify from "../../features/notifications/useNotify";

export default function ProfilePage() {
  const navigate = useNavigate();
  const api = useApi();
  const notifier = useNotify();
  const [userInfo, setUserInfo] = useState<undefined | User>();

  useEffect(() => {
    api.isLoggedIn().then((isLoggedIn) => {
      if (!isLoggedIn) {
        navigate("/login");
      }
    });
  }, [api, navigate]);

  useEffect(() => {
    api
      .getCurrentUserInfo()
      .then((response) => {
        if (!response || !response.data) throw response;
        setUserInfo(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [api]);

  const onLogOut = () => {
    if (!userInfo) return;
    const confirm = window.confirm("Вы точно хотите выйти из аккаунта?");
    if (!confirm) return;
    api
      .logOut()
      .then(() => {
        navigate("/shop");
      })
      .catch((error) => {
        notifier.notifyError(
          "Не удалось выйти из аккаунта, попробуйте позже.",
          3000,
        );
        console.error(error);
      });
  };

  const onDeleteAccount = () => {
    if (!userInfo) return;
    const confirm = window.confirm(
      "Вы точно хотите удалить свой аккаунт? Это действие нельзя отменить!",
    );
    if (!confirm) return;
    api
      .deleteUserById(userInfo.id)
      .then((response) => {
        notifier.notifySuccess("Аккаунт удален.");
        setTimeout(() => {
          navigate("/shop");
        }, 1000);
        console.log(response);
      })
      .catch((response) => {
        notifier.notifyError(
          "Не удалось удалить аккаунт, попробуйте позже.",
          3000,
        );
        console.error(response);
      });
  };

  return (
    userInfo && (
      <FlexContainer flexDir="col" className="gap-10">
        <h1 className="text-3xl">Ваш профиль</h1>
        <FlexContainer flexDir="col" className="gap-6">
          <UserInfoCard label="Имя" value={userInfo.firstName} />
          <UserInfoCard label="Фамилия" value={userInfo.lastName} />
          <UserInfoCard label="Почта" value={userInfo.email} />
        </FlexContainer>
        <AccountActions onDeleteAccount={onDeleteAccount} onLogOut={onLogOut} />
      </FlexContainer>
    )
  );
}
