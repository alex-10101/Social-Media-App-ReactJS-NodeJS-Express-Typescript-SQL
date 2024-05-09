import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import { useEffect, useRef, useState } from "react";
import { useRegisterUserMutation } from "../features/auth/authApiSlice";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../app/hooks";
import { removeCredentials, setCredentials } from "../features/auth/authSlice";
import { apiSlice } from "../app/api/apiSlice";
import Loading from "../components/Loading";
import axios from "axios";
import { IUser } from "../types/types";
import AxiosBaseError from "../components/AxiosBaseError";

/**
 *
 * @returns A page where a user can register.
 */
function Register() {
  const [user_name, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [user_password, setPassword] = useState("");
  const [real_name, setRealName] = useState("");
  const navigate = useNavigate();
  const [register, { error }] = useRegisterUserMutation();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // needed with react 18 (useEffect runs twice in dev mode)
  const effectRan = useRef(false);

  /**
   * Make a POST request to create a new account when the user clicks the "Register" button.
   * @param e
   */
  async function handleRegister(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    e.preventDefault();
    await register({ user_name, email, user_password, real_name }).unwrap();
    navigate("/login");
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
      <h1>Register</h1>
      <Form>
        <Form.Group className="mb-3 my-3" controlId="formBasicEmail">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3 my-3" controlId="formBasicEmail">
          <Form.Label>Real name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            onChange={(e) => setRealName(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicEmail">
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
            Password must contain minimum 12 characters and include lower case
            letters, upper case letters, numbers and special characters!
          </Form.Text>
        </Form.Group>

        {error && <AxiosBaseError error={error} />}

        <Button variant="primary" type="submit" onClick={handleRegister}>
          Register
        </Button>
      </Form>
    </Container>
  );
}

export default Register;
