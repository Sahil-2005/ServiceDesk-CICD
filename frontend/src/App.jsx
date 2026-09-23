import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import TicketList from './pages/TicketList.jsx';
import TicketDetail from './pages/TicketDetail.jsx';
import TicketCreate from './pages/TicketCreate.jsx';
import TicketEdit from './pages/TicketEdit.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="tickets" element={<TicketList />} />
          <Route path="tickets/new" element={<TicketCreate />} />
          <Route path="tickets/:id" element={<TicketDetail />} />
          <Route path="tickets/:id/edit" element={<TicketEdit />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
