import "./App.css";
import { FcCalculator } from "react-icons/fc"; // Altere o ícone para um ícone de calculadora
import { Form } from "./components/Form";

function App() {
  return (
    <div
      className="App container"
      style={{ maxWidth: 500, margin: "1rem auto" }}
    >
      <h1 className="display-1 mb-3">
        <FcCalculator />
      </h1>
      <Form />
    </div>
  );
}

export default App;
