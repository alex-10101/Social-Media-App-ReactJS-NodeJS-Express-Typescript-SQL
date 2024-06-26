import { useEffect, useRef, useState } from "react";
import { useAppDispatch } from "../app/hooks";
import { useLoginUserMutation } from "../features/auth/authApiSlice";
import { removeCredentials, setCredentials } from "../features/auth/authSlice";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import { Link, useNavigate } from "react-router-dom";
import { apiSlice } from "../app/api/apiSlice";
import Loading from "../components/Loading";
import AxiosBaseError from "../components/AxiosBaseError";
import axios from "axios";
import { IUser } from "../types/types";

/**
 *
 * @returns a page where a user can login with email and password
 */
function Login() {
  const [email, setEmail] = useState<string>("");
  const [user_password, setPassword] = useState<string>("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [login, { error }] = useLoginUserMutation();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // needed with react 18 (useEffect runs twice in dev mode)
  const effectRan = useRef(false);

  /**
   * Make a POST request to log in when the user clicks the "Login" button.
   * @param e
   */
  async function handleLogin(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    e.preventDefault();
    const loginData = await login({ email, user_password }).unwrap();
    dispatch(setCredentials({ ...loginData }));
    navigate("/");
  }

  // check when the component mounts if the user is authenticated. If yes redirect him to the home page.
  useEffect(() => {
    async function redirectAuthenticatedUser() {
      try {
        const newResponse = await axios.post<{
          user: IUser;
          newAccessToken: string;
        }>("http://localhost:3000/api/auth/refresh", null, {
          withCredentials: true,
        });
        if (
          newResponse.data &&
          newResponse.data.user &&
          newResponse.data.newAccessToken
        ) {
          dispatch(
            setCredentials({
              user: newResponse.data.user,
              accessToken: newResponse.data.newAccessToken,
            })
          );
          navigate("/");
        } else {
          // assume refresh token expired and log user out
          await axios.post("http://localhost:3000/api/logout", {
            withCredentials: true,
          });
          dispatch(removeCredentials());
          dispatch(apiSlice.util.resetApiState());
        }
      } catch (err) {
        // assume refresh token expired and log user out
        await axios.post("http://localhost:3000/api/logout", {
          withCredentials: true,
        });
        dispatch(removeCredentials());
        dispatch(apiSlice.util.resetApiState());
      } finally {
        setIsLoading(false);
      }
    }
    if (effectRan.current === false) {
      redirectAuthenticatedUser();

      return () => {
        effectRan.current = true;
      };
    }
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Container className="d-flex min-vh-100 justify-content-center align-items-center flex-column">
      <h1>Login</h1>
      <Form>
        <Form.Group className="mb-3 my-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <Form.Text className="text-muted">
            Did not register yet? Navigate to{" "}
            <Link
              to="/register"
              style={{
                textDecoration: "none",
                cursor: "pointer",
              }}
            >
              Register Page
            </Link>
          </Form.Text>
        </Form.Group>

        {error && <AxiosBaseError error={error} />}

        <Button variant="primary" type="submit" onClick={handleLogin}>
          Login
        </Button>
      </Form>
    </Container>
  );
}

export default Login;
