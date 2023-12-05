import './styles/index.css';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom';
import Auth from './components/Auth';
import Main from './components/Chat';
import { Provider } from 'react-redux';
import { store } from './app/store';
import ErrorElement from './ErrorElement';
import SignUp from './components/Auth/SignUp';
import SignIn from './components/Auth/SignIn';
import Letter from './components/Auth/Letter';
import Confirmation from './components/Auth/Confirmation';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);


const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorElement />,
    children: [
      {
        index: true,
        element: <Main />
      },
      {
        path: '/auth',
        element: <Auth />
      },
      {
        path: '/auth/sign-in',
        element: <SignIn />
      },
      {
        path: '/auth/sign-up',
        element: <SignUp />
      },
      {
        path: '/auth/letter-sent',
        element: <Letter />
      },
      {
        path: '/auth/confirmation/:uuid',
        element: <Confirmation />
      },
    ]
  },
])

root.render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);