import { Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./modules/authentication/Login";
import AuthLayout from "./layout/AuthLayout";
import AppLayout from "./layout/AppLayout";
import Register from "./modules/authentication/Register";
import Feeds from "./modules/feeds/Feeds";
import SelfProfile from "./modules/profile/SelfProfile";
import OtherUserProfile from "./modules/profile/OtherUserProfile";
import Explore from "./modules/explore/Explore";
import Edit from "./modules/edit/Edit";
import { WildCard } from "./modules/wildcard/WildCard";
import Messenger from "./modules/messenger/Messenger";
import ChatBox from "./modules/messenger/components/ChatBox";
import Reels from "./modules/reels/Reels";
import Post from "./modules/post.tsx/Post";
import SessionExpire from "./modules/wildcard/SessionExpire";
import MobileSearch from "./modules/search/MobileSearch";
import MobileNotifications from "./modules/notifications/MobileNotifications";

function App() {
  return (
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
  );
}

export default App;
