import {Routes , Route} from "react-router-dom"
import AuthPage from "./Pages/AuthPage"
import MainPage from "./Pages/MainPage"
import Compiler from "./Pages/Compiler"
import SandBoxPage from "./Pages/SandBoxPage"
function App() {
  return (
    <>
      <Routes>
        <Route path="/auth" Component={AuthPage}/>
        <Route path="/home" Component={MainPage} />
        <Route path="/compiler/" Component={Compiler} />
        <Route path="/sandbox/" Component={SandBoxPage} />
      </Routes>
    </>
  )
}

export default App
