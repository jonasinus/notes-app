import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

function Hello() {
  return <div></div>;
}

function Main() {
  return <main>main</main>;
}

export default function App() {
  return (
    <Router>
      <div>
        <nav></nav>
        <Routes>
          <Route path="/" element={<Main />} />
        </Routes>
      </div>
    </Router>
  );
}
