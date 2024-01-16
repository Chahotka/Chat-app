import Auth from "./components/Auth"
import Main from "./components/Main"
import ErrorElement from "./ErrorElement"
import Room from "./components/Rooms/Room"
import { RouteObject } from "react-router-dom"
import SignUp from "./components/Auth/SignUp"
import SignIn from "./components/Auth/SignIn"

const Routes: RouteObject[] = [
  {
    path: '/auth',
    element: <Auth />
  },
  {
    path: 'auth/sign-up',
    element: <SignUp />
  },
  {
    path: 'auth/sign-in',
    element: <SignIn />
  },
  {
    path: '/',
    element: <Main />,
    errorElement: <ErrorElement />,
    children: [
      {
        path: 'room/:roomId',
        element: <Room />
      },
    ],
  }
]

export default Routes
