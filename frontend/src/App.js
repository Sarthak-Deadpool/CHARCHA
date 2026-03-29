/** @format */

import './App.css';
import { BrowserRouter as Router, Route } from "react-router-dom";
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';

import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { Toaster, toaster } from "./components/ui/toaster"

function App() {
  return (
    <ChakraProvider value={defaultSystem}>
      <Router>
        <div className="App">

          <Route path="/" component={HomePage} exact />
          <Route path="/chats" component={ChatPage} />

          <Toaster/>

        </div>
      </Router>
    </ChakraProvider>
  );
}

export default App;