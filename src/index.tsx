import './styles/index.css';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import Routes from './Routes';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const router = createBrowserRouter(Routes)

root.render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);