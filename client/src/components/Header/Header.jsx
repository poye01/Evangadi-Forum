import { useContext } from "react";
import classes from "./header.module.css";
import EvangadiLogo from "../../Assets/Images/evangadi-logo-header.png";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Nav, Button, Container } from "react-bootstrap";
import { UserState } from "../../App.jsx";

function Header() {
  const userContextData = useContext(UserState);
  const user = userContextData?.user;
  const setUser = userContextData?.setUser;
  const userId = user?.userid;
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem("EVANGADI_FORUM_2024");
    setUser({});
    navigate("/auth");
  };

  return (
    <>
      <Navbar
        bg="light "
        variant="light"
        expand="md"
        className="px-3"
        style={{
          position: "sticky",
          top: "0",
          zIndex: "3",
          backgroundColor: "white",
          borderBottom: "1px solid #dee2e6",
        }}
      >
        <Container className={classes.header_container}>
          <Navbar.Brand>
            <Link to={"/"}>
              <img
                src={EvangadiLogo}
                className="d-inline-block align-top"
                alt="Evangadi Logo"
                width="200"
              />
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav  d-md-none">
            <span className="navbar-toggler-icon"></span>
          </Navbar.Toggle>
          <Navbar.Collapse
            id="basic-navbar-nav"
            className=" w-50 flex-md-row"
            style={{ alignSelf: "flex-end" }}
          >
            <Nav className="flex-column flex-md-row w-100 justify-content-end nav-links-holder">
              <Nav.Link as={Link} to="/" className={classes.navigation_links}>
                Home
              </Nav.Link>

              <Nav.Link
                as={Link}
                to="/howitworks"
                className={classes.navigation_links}
              >
                How it Works
              </Nav.Link>
              {userId ? (
                <Button onClick={handleSignOut} className={classes.logout_btn}>
                  Logout
                </Button>
              ) : (
                <Nav.Link
                  as={Link}
                  to="/auth"
                  className={`${classes.navigation_links} ${classes.login_btn}`}
                >
                  Login
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default Header;
