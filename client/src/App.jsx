import {Routes , Route} from "react-router-dom"
import AuthPage from "./Pages/AuthPage"
import MainPage from "./Pages/MainPage"
import Compiler from "./Pages/Compiler"
function App() {
  return (
    <>
      <Routes>
        <Route path="/auth" Component={AuthPage}/>
        <Route path="/home" Component={MainPage} />
        <Route path="/compiler/" Component={Compiler} />
      </Routes>
    </>
  )
}

export default App
