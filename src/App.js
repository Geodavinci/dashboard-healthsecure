import { useState } from "react";
import Login from "./Login";
import Patients from "./Patients";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  if (!loggedIn) {
    return <Login onLogin={() => setLoggedIn(true)} />;
  }

  return <Patients />;
}

export default App;
