import homeWhite from "../../assets/images/main-home-white.png"
import homeBlack from "../../assets/images/main-home-black.png"
import notificationWhite from "../../assets/images/notification-white.png"
import notificationBlack from "../../assets/images/notification-black.png"
import profile from "../../assets/images/profile.png"
import settings from "../../assets/images/settings.png"


export default function Navbar(props) {
    
  return (
    <div className="navbar-container">
        <div className="navbar-content-container">
            <div className="navbar-content-logo-container">

            </div>
            <div className="navbar-content-element-container" style={{backgroundColor : props.page === "home" ? "var(--black)" : "var(--lightRed)"}}>
                <img src={props.page === "home" ? homeWhite : homeBlack} alt="home" />
            </div>
            <div className="navbar-content-element-container" style={{backgroundColor : props.page === "notification" ? "var(--black)" : "var(--lightRed)"}}>
                <img src={props.page === "notification" ? notificationWhite : notificationBlack} alt="notification" />
            </div>
        </div>
        <div className="navbar-profile-container">
            <div className="navbar-profile-settings-container">
                <img src={settings} alt="settings" >
                </img>
            </div>
            <div className="navbar-profile-element-container">
                <img src={profile} alt="img"/>
            </div>
        </div>
    </div>
  )
}
