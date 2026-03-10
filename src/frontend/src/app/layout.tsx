import { Outlet } from "react-router";
import Header from "../shared/ui/Header";
import Main from "../shared/ui/Main";
import Footer from "../shared/ui/Footer";

export default function RootLayout() {
  return <div id="root">
    <Header/>
    <Main>
      <Outlet />
    </Main>
    <Footer/>
  </div>
}