import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import "./App.css";
import AuthLayout from "./layout/AuthLayout";
import AppLayout from "./layout/AppLayout";
import PageLoading from "./components/shared/Loading/PageLoading";
import PostOptions from "./components/PostOptions";

// Lazy imports for code splitting
const Login = lazy(() => import("./modules/authentication/Login"));
const Register = lazy(() => import("./modules/authentication/Register"));
const Feeds = lazy(() => import("./modules/feeds/Feeds"));
const SelfProfile = lazy(() => import("./modules/profile/SelfProfile"));
const OtherUserProfile = lazy(() => import("./modules/profile/OtherUserProfile"));
const Explore = lazy(() => import("./modules/explore/Explore"));
const Edit = lazy(() => import("./modules/edit/Edit"));
const WildCard = lazy(() => import("./modules/wildcard/WildCard"));
const Messenger = lazy(() => import("./modules/messenger/Messenger"));
const ChatBox = lazy(() => import("./modules/messenger/components/ChatBox"));
const Reels = lazy(() => import("./modules/reels/Reels"));
const Post = lazy(() => import("./modules/post.tsx/Post"));
const SessionExpire = lazy(() => import("./modules/wildcard/SessionExpire"));
const MobileSearch = lazy(() => import("./modules/search/MobileSearch"));
const MobileNotifications = lazy(() => import("./modules/notifications/MobileNotifications"));

function App() {
  return (
    <Suspense fallback={<PageLoading/>}>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="new-account" element={<Register />} />
        </Route>
        <Route element={<AppLayout />}>
          <Route path="" element={<Feeds />} />
          <Route path="/profile" element={<SelfProfile />} />
          <Route path="/p/:postId" element={<Post />} />
          <Route path="/u/:username" element={<OtherUserProfile />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/edit" element={<Edit />} />
          <Route path="/reels" element={<Reels />} />
          <Route path="/search" element={<MobileSearch />} />
          <Route path="/notifications" element={<MobileNotifications />} />
          
          <Route path="/inbox" element={<Messenger />}>
            <Route path=":chatId" element={<ChatBox />} />
          </Route>
        </Route>
        <Route path="*" element={<WildCard />} />
        <Route path="session-expire" element={<SessionExpire />} />
      </Routes>
    </Suspense>
  );
}

export default App;
