import { useEffect, useState } from "react";
import useApi from "../../features/api/useApi";
import { useNavigate } from "react-router";
import User from "../../entities/User";
import UserInfoCard from "./ui/UserInfoCard";
import AccountActions from "./ui/AccountActions";
import FlexContainer from "../../shared/ui/FlexContainer";

export default function ProfilePage() {
  const navigate = useNavigate();
  const api = useApi();
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

  const onLogOut = () => {};

  const onDeleteAccount = () => {};

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
