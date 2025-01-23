import { useState } from "react"
import "../styles/AuthPage.css"


import Login from "../components/AuthPage/Login"
import Signup from "../components/AuthPage/Signup"

export default function AuthPage() {
    const [isLogin , setLogin] = useState(true)
  return (
    <section className="auth-page-container">
        <div className="auth-page-inner-container" style={{ transform: isLogin ? null : "translateX(-100vw)" }}>
            <div className="auth-page-login-container">
                <div className="auth-page-login-form-container">
                <Login />
                </div>
                <div className="auth-page-login-illustration-container">
                    <div className="auth-page-login-illustration-inner-container">
                        <button onClick={() => setLogin(false)}>
                            Signup
                        </button>
                    </div>
                </div>
            </div>
            <div className="auth-page-signup-container">
            
                <div className="auth-page-signup-illustration-container">
                    <div className="auth-page-signup-illustration-inner-container">
                        <button onClick={() => setLogin(true)}> Login</button>
                    </div>
                </div>
                <div className="auth-page-signup-form-container">
                <Signup />
                </div>
            </div>
        </div>
    </section>
  )
}
