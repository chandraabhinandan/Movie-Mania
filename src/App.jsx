
import './App.css';
import Home from './pages/home';
import { BrowserRouter, Route, Routes} from 'react-router-dom';
import Search from './pages/search';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
