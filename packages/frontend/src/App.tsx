import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import SessionsList from "./components/SessionsList";
import SessionPage from "./components/SessionPage";
import SessionManager from "./components/SessionManager";

const HomePage = () => {
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <SessionManager />
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-blue-600 text-white p-4">
          <div className="container mx-auto">
            <Link to="/" className="text-xl font-bold">
              AI Brainstorm
            </Link>
          </div>
        </header>

        <main className="py-6">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/sessions/:sessionId" element={<SessionPage />} />
          </Routes>
        </main>

        <footer className="bg-gray-200 p-4 text-center text-gray-600">
          <div className="container mx-auto">
            <p>&copy; {new Date().getFullYear()} AI Brainstorm</p>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
};

export default App;
