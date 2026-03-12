import { Link, Outlet } from "react-router";
import Header from "../shared/ui/Header";
import Main from "../shared/ui/Main";
import Footer from "../shared/ui/Footer";
import FlexContainer from "../shared/ui/FlexContainer";

export default function RootLayout() {
  return (
    <div id="root">
      <Header className="w-dvw flex justify-between items-center px-6 py-3 gap-4 border-b-amber-600 border-b-2">
        <Link to={"/shop"}>
          <h1 className="text-2xl">E-commerce website</h1>
        </Link>
        <input
          className="flex-1 border border-black px-2 py-0.5 max-w-200"
          type="search"
          name="productSearch"
          id="product-search"
        />
        <FlexContainer className="gap-4">
          <Link to={"/register"}>Зарегистрироваться</Link>
          <Link to={"/login"}>Войти</Link>
        </FlexContainer>
      </Header>
      <Main className="flex flex-col justify-center items-center">
        <Outlet />
      </Main>
      <Footer />
    </div>
  );
}
