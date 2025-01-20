import '@/assets/css/settings.css';
import { UserProvider } from '@/libs/store/User/STUser';
import { createBrowserRouter } from "react-router-dom";
import Layout from "./pages/Layout";

import PageAuth from "@/app/pages/Auth/page";
import PagePost from './pages/Post/page';

import Feed from '@/components/core/Feed';
import EditorPost from './pages/PostEditor/page';
import PageContacts from './pages/Contacts/page';
import UserList from './pages/UserList/page';
import IsUserAuth from '@/components/shared/isUserAuth';


export default createBrowserRouter([
  {
    path: "/",
    element: (
      <UserProvider>
        <Layout/>
      </UserProvider>
    ),
    children: [
      {path: "/", element: <Feed/>},
      {path: "/users-list", element: <IsUserAuth redirectTo='/' children={<UserList/>}  />},
      {path: "/contacts", element: <IsUserAuth redirectTo='/' children={<PageContacts/>}  />},
      {path: "/auth", element: <PageAuth/>},
      {path: "/post/:id", element: <PagePost/>},
      {path: "/editor-post/:id?", element: <IsUserAuth redirectTo='/' children={<EditorPost/>}  />},
    ]
  }
]);
