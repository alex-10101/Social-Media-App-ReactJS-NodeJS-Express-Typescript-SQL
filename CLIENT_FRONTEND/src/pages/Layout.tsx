import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { removeCredentials } from "../features/auth/authSlice";
import { useDispatch } from "react-redux";
import { apiSlice } from "../app/api/apiSlice";
import { useLogoutUserMutation } from "../features/auth/authApiSlice";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import AxiosBaseError from "../components/AxiosBaseError";

/**
 *
 * @returns A component which defines the layout of the application.
 */
function Layout() {
  const currentUser = useAppSelector((state) => state.auth.user);

  const dispatch = useDispatch();

  const [logout, { error }] = useLogoutUserMutation();

  const navigate = useNavigate();

  /**
   * Make a POST request to log out when the user clicks "Log Out".
   */
  async function handleLogout(e: React.MouseEvent<HTMLElement, MouseEvent>) {
    e.preventDefault();
    await logout().unwrap();
    dispatch(removeCredentials());
    dispatch(apiSlice.util.resetApiState());
    // navigate("/login")
  }

  /**
   * Navigate to the change password page when the user clicks "Change Password".
   * @param e
   */
  function handleNavigateToResetPasswordPage(
    e: React.MouseEvent<HTMLElement, MouseEvent>
  ) {
    e.preventDefault();
    navigate("/resetPassword");
  }

  /**
   * Navigate to the delete account page when the user clicks "Delete Account".
   * @param e
   */
  function handleNavigateToDeleteAccountPage(
    e: React.MouseEvent<HTMLElement, MouseEvent>
  ) {
    e.preventDefault();
    navigate("/deleteAccount");
  }

  return (
    <>
      {currentUser && (
        <Navbar
          collapseOnSelect
          expand="lg"
          className="bg-body-tertiary"
          sticky="top"
        >
          <Container>
            <Link to="/" style={{ textDecoration: "none", cursor: "pointer" }}>
              <Navbar.Brand>Welcome {currentUser.user_name}</Navbar.Brand>
            </Link>

            <Navbar.Toggle aria-controls="responsive-navbar-nav" />

            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="me-auto"></Nav>

              <Nav>
                <Link
                  style={{
                    textDecoration: "none",
                    cursor: "pointer",
                    display: "flex", // otherwise it is not centered vertically
                    marginRight: "20px", // to add more space to the text right of the link
                  }}
                  to="/addPost"
                >
                  <Navbar.Text>Add Post </Navbar.Text>
                </Link>

                <Link
                  style={{
                    textDecoration: "none",
                    cursor: "pointer",
                    display: "flex", // otherwise it is not centered vertically
                    marginRight: "20px", // to add more space to the text right of the link
                  }}
                  to={`profile/${currentUser.user_id}`}
                >
                  <Navbar.Text>Profile </Navbar.Text>
                </Link>

                <NavDropdown
                  title="Account Settings"
                  id="navbarScrollingDropdown"
                >
                  <NavDropdown.Item
                    onClick={handleLogout}
                    style={{
                      cursor: "pointer",
                    }}
                  >
                    Log Out
                  </NavDropdown.Item>

                  <NavDropdown.Item
                    onClick={handleNavigateToResetPasswordPage}
                    style={{
                      cursor: "pointer",
                    }}
                  >
                    Change Password
                  </NavDropdown.Item>

                  <NavDropdown.Divider />
                  <NavDropdown.Item
                    onClick={handleNavigateToDeleteAccountPage}
                    style={{
                      cursor: "pointer",
                    }}
                  >
                    Delete Account
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      )}
      {error && <AxiosBaseError error={error} />}

      <Outlet />
    </>
  );
}

export default Layout;
