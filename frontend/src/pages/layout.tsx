import { Link, Outlet } from "react-router";
import Header from "@/shared/ui/Header";
import Main from "@/shared/ui/Main";
import Footer from "@/shared/ui/Footer";
import FlexContainer from "@/shared/ui/FlexContainer";
import { ToastContainer } from "react-toastify";
import useApi from "@/features/api/useApi";
import { useEffect, useState } from "react";
import ProfileImage from "@/shared/ui/ProfileImage";
import logo from "@/shared/svg/logo.svg";
import useUserInfo from "@/features/api/hooks/useUserInfo";

export default function RootLayout() {
  const api = useApi();
  const userInfo = useUserInfo();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    api
      .isLoggedIn()
      .then((v) => setIsLoggedIn(v))
      .catch(() => setIsLoggedIn(false));
  }, [api]);

  return (
    <div id="root">
      <Header className="w-dvw flex justify-between items-center px-6 py-3 gap-4 border-b-amber-600 border-b-2">
        <Link to={"/shop"}>
          <FlexContainer className="gap-4">
            <img
              src={logo}
              alt="logo"
              width={32}
              height={32}
              className="rounded-sm"
            />
            <h1 className="text-2xl">E-commerce</h1>
          </FlexContainer>
        </Link>
        <input
          className="flex-1 border border-black px-2 py-0.5 max-w-200"
          type="search"
          name="productSearch"
          id="product-search"
        />
        <FlexContainer className="gap-4">
          {!isLoggedIn ? (
            <>
              <Link to={"/register"}>Зарегистрироваться</Link>
              <Link to={"/login"}>Войти</Link>
            </>
          ) : (
            <>
              {userInfo?.roles.includes("seller") && (
                <Link to={"/products/create"}>Опубликовать товар</Link>
              )}
              <ProfileImage to={"/profile"} />
            </>
          )}
        </FlexContainer>
      </Header>
      <Main className="flex flex-col items-center">
        <Outlet />
      </Main>
      <Footer />
      <ToastContainer />
    </div>
  );
}
