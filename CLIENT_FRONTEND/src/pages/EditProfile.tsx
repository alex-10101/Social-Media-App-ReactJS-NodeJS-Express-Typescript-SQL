import EditProfileForm from "../components/EditProfileForm";
import { useAppSelector } from "../app/hooks";

/**
 *
 * @returns A page. where the user can edit his/her profile.
 */
function EditProfile() {
  const currentUser = useAppSelector((state) => state.auth.user);
  // add '!' to please typescript: Type 'IUser | null' is not assignable to type 'IUser'.
  return <EditProfileForm user={currentUser!} />;
}

export default EditProfile;
