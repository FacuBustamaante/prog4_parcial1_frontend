import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CategoriasPage from './pages/CategoriasPage';
import ProductosPage from './pages/ProductosPage';
import IngredientesPage from './pages/IngredientesPage';

const Navbar = () => (
   <nav className="bg-slate-800 text-white p-4 flex gap-6 shadow-md">
      <Link to="/" className="font-bold hover:text-blue-400">Inicio</Link>
      <Link to="/categorias" className="hover:text-blue-400">Categorías</Link>
      <Link to="/productos" className="hover:text-blue-400">Productos</Link>
      <Link to="/ingredientes" className="hover:text-blue-400">Ingredientes</Link>
   </nav>
);

function App() {
   return (
      <Router>
         <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="container mx-auto p-6">
               <Routes>
                  <Route path="/" element={<h1 className="text-3xl font-bold">Bienvenido al Sistema de Gestión</h1>} />
                  <Route path="/categorias" element={<CategoriasPage />} />
                  <Route path="/ingredientes" element={<IngredientesPage />} />
                  <Route path="/productos" element={<ProductosPage />} />
                  <Route path="/productos/:id" element={<div>Detalle del Producto (Próximamente)</div>} />
               </Routes>
            </main>
         </div>
      </Router>
   );
}

export default App;