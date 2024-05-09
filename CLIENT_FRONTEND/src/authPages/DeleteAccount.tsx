import { useState } from "react";
import { useAppDispatch } from "../app/hooks";
import { removeCredentials } from "../features/auth/authSlice";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import { useDeleteUserMutation } from "../features/users/usersApiSlice";
import { apiSlice } from "../app/api/apiSlice";
import AxiosBaseError from "../components/AxiosBaseError";

/**
 *
 * @returns A page where the user can delete his/her account
 */
function DeleteAccount() {
  const [password, setPassword] = useState("");
  const [deleteAccount, { error }] = useDeleteUserMutation();
  const dispatch = useAppDispatch();

  /**
   * Make a DELETE request to delete the account when the user clicks the "Delete Account" button.
   */
  async function handleDeleteAccount(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    e.preventDefault();
    await deleteAccount({ password }).unwrap();
    dispatch(removeCredentials());
    dispatch(apiSlice.util.resetApiState());
  }

  return (
    <Container className="my-4">
      <h1>Delete Account (action is permanent!)</h1>
      <Form>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        {/**If an error occured, show the error message. The error message comes from the server. */}
        {error && <AxiosBaseError error={error} />}

        <Button variant="primary" type="submit" onClick={handleDeleteAccount}>
          Delete Account
        </Button>
      </Form>
    </Container>
  );
}

export default DeleteAccount;
