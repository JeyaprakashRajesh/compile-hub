
export default function Header({userData}) {
  return (
    <div className="home-header-container">
        <div className="home-header-heading-container">
            COMPILE HUB
        </div>
        <div className="home-header-content-container">
            <div className="home-header-content-profile-container">
                <span>👋 Hello {userData.username}</span>
                <div></div>
            </div>
        </div>
    </div>
  )
}
