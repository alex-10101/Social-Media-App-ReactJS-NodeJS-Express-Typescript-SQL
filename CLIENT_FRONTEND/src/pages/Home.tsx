import Container from "react-bootstrap/Container";
import { useAppSelector } from "../app/hooks";
import { useGetAllPostsQuery } from "../features/posts/postsApiSlice";
import Post from "../components/Post";
import Loading from "../components/Loading";
import AxiosBaseError from "../components/AxiosBaseError";

/**
 *
 * @returns Component which represents the home page and displays all the posts.
 */
function Home() {
  const currentUser = useAppSelector((state) => state.auth.user);

  const {
    data: posts,
    error,
    isLoading,
  } = useGetAllPostsQuery(currentUser?.user_id!);

  if (error) {
    return <AxiosBaseError error={error} />;
  }

  if (isLoading || !posts) {
    return <Loading />;
  }

  return (
    <Container>
      {posts.map((post) => (
        <Post key={post.post_id} post={post} />
      ))}
    </Container>
  );
}

export default Home;
