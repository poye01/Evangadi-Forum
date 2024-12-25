import Header from "../components/Header/Header.jsx";
import Footer from "../components/Footer/Footer.jsx";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div>
      <Header />
      <div style={{ minHeight: "100vh !important" }}>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default Layout;
