import Navbar from "../components/Navbar"
import { withUrqlClient } from 'next-urql';
import { createURQLClient } from "../utils/createURQLClient";
import { usePostsQuery } from "../generated/graphql";



const Index = () => {

  const [{ data }] = usePostsQuery();

  return (
    <div>
      <Navbar />
      <div> Hello </div>
      <br />
      {
        data?.posts ? data.posts.map(item => (
          <div key={item.id}>{item.title}</div>
        )) : <div>Nothing renter</div>
      }
    </div>
  )
}

export default withUrqlClient(createURQLClient, { ssr: true })(Index);
