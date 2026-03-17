import React, { useState, useEffect } from 'react'
import PostCard from '../components/Post/PostCard'
import TopNav from '../components/Navbar/TopNav'
import BottomNav from '../components/Navbar/BottomNav'
import { getAllPost, getUser } from '../services/operations/postAPI'
import { useDispatch, useSelector } from "react-redux"
import FollowCard from '../components/Common/FollowCard'
import { setUserInfo } from '../slices/profileSlice'
import Comment from '../components/Post/Comment'
import { userNotFollowed } from '../services/operations/userAPI'
import Loading from '../components/Loader/Loading'

const Feed = () => {
  const token = localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token")) : null;

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const refresh = useSelector((state) => state.refresh.postRefresh);
  const dispatch = useDispatch();
  const [userId, setUserId] = useState({});
  const [commData, setCommData] = useState({});
  const [userNotFollow, setUserNotFollow] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const postResponse = await getAllPost(token);
        if (postResponse && postResponse.data && postResponse.data.data) {
          setPosts(postResponse.data.data?.reverse());
        
        } else {
          setPosts([]);
        }

        console.log("Posts fetched:", postResponse.data.data);

        const userData = await getUser(token);
        if (userData && userData.data && userData.data.data) {
          setUserId(userData.data.data);
          dispatch(setUserInfo(userData.data.data));
        }

        const unfollowedResponse = await userNotFollowed(token);
        if (unfollowedResponse && unfollowedResponse.data && unfollowedResponse.data.data) {
          setUserNotFollow(unfollowedResponse.data.data);
        }
      } catch (error) {
        console.log("Error occurred while fetching data:", error);
        setError("Failed to load feed. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refresh, token, dispatch]);

  if (loading) {
    return <Loading />;
  }

  if (commData && Object.keys(commData).length !== 0) {
    return (
      <div>
        <Comment post={commData} setCommData={setCommData} commData={commData} />
      </div>
    );
  }

  return (
    <>
      <div className='mt-2 max-w-[500px] mx-auto px-2'>
        <TopNav />
        
        {error && (
          <div className='text-center text-red-500 py-4'>
            <p>{error}</p>
          </div>
        )}

        <div className='text-sm text-slate-500 mb-2'>
          Showing {posts.length} update{posts.length === 1 ? "" : "s"}
        </div>

        {posts && posts.length > 0 ? (
          posts.map((post, ind) => (
            <PostCard post={post} key={ind} setCommData={setCommData} />
          ))
        ) : (
          <div className='text-center py-8 text-slate-500'>
            <p>No insights yet. Connect with colleagues to see their updates.</p>
          </div>
        )}
        
        <BottomNav />
      </div>

      <div className='py-8 w-[350px] px-4 hidden sm:block border-2 sticky right-0 top-0 max-h-screen overflow-y-auto'>
        <FollowCard user={userId} choice={"follower"} />

        <h1 className='mt-5 font-semibold'>Suggested For You</h1>
        <div className='mt-5 flex flex-col gap-2'>
          {userNotFollow && userNotFollow.length > 0 ? (
            userNotFollow.map((user, ind) => (
              <div key={ind}>
                <FollowCard user={user} />
              </div>
            ))
          ) : (
            <p className='text-gray-500 text-sm'>No suggestions available</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Feed;
