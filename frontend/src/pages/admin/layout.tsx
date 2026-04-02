import FlexContainer from "@/shared/ui/FlexContainer";
import { Link, Outlet } from "react-router";

export default function Layout() {
  return (
    <FlexContainer>
      <div className="tabs">
        <Link to={"/admin/users"}>Пользователи</Link>
        <Link to={"/admin/products"}>Товары</Link>
      </div>
      <Outlet />
    </FlexContainer>
  );
}
