import { createBrowserRouter } from 'react-router-dom'
import Shell from './layout/Shell'
import Home from './pages/Home'
import About from './pages/About'
import Support from './pages/Support'
import Contact from './pages/Contact'

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Shell />,
      children: [
        { index: true, element: <Home /> },
        { path: 'about', element: <About /> },
        { path: 'support', element: <Support /> },
        { path: 'contact', element: <Contact /> },
      ],
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  },
)
