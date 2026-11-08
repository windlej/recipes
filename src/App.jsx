import { HashRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import RecipePage from './pages/RecipePage'
import FridgePage from './pages/FridgePage'
import FavoritesPage from './pages/FavoritesPage'
import CreditsPage from './pages/CreditsPage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="recipe/:id" element={<RecipePage />} />
          <Route path="fridge" element={<FridgePage />} />
          <Route path="favorites" element={<FavoritesPage />} />
          <Route path="credits" element={<CreditsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
