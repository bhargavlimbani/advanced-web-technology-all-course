import React from "react";
import StudentCrud from "./components/StudentCrud";

function App() {
  return (
    <div>
      <h2 style={{textAlign:"center"}}>Firebase CRUD App</h2>
      <StudentCrud />
    </div>
  );
}

export default App;