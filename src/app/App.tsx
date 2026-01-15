import { RouterProvider } from 'react-router-dom'
import { ThemeProvider } from './theme/ThemeProvider'
import { router } from './router'

const App = () => {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}

export default App
