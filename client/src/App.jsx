import {Routes , Route} from "react-router-dom"
import AuthPage from "./Pages/AuthPage"
import { useEffect} from "react"
import { useNavigate } from "react-router-dom"
import MainPage from "./Pages/MainPage"
function App() {
  const navigate = useNavigate()
  useEffect(()=> {
    const token = localStorage.getItem("token")
    if(token) {
      navigate("/home")
    }else {
      navigate("/auth")
    }
  },[navigate])
  return (
    <>
      <Routes>
        <Route path="/auth" Component={AuthPage}/>
        <Route path="/home" Component={MainPage} />
      </Routes>
    </>
  )
}

export default App
