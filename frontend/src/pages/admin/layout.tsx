import useUserInfo from "@/features/api/hooks/useUserInfo";
import FlexContainer from "@/shared/ui/FlexContainer";
import ProtectedRouteError from "@/widgets/ProtectedRouteError";
import { Link, Outlet } from "react-router";

export default function Layout() {
  const userInfo = useUserInfo();

  if (userInfo && !userInfo?.roles.includes("admin")) {
    return <ProtectedRouteError reason="Вы не являетесь администратором." />;
  }

  return (
    userInfo && (
      <FlexContainer
        flexDir="col"
        justify="center"
        align="center"
        className="gap-6"
      >
        <FlexContainer
          justify="center"
          align="center"
          className="tabs border-b-2 border-b-blue-400 p-2 gap-2 text-2xl max-w-max"
        >
          <Link to={"/admin/users"}>Пользователи</Link>
          <Link to={"/admin/products"}>Товары</Link>
        </FlexContainer>
        <Outlet />
      </FlexContainer>
    )
  );
}
