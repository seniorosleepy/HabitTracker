import backgroundImage from "../assets/white-background-image.jpg";
function MainScreen() {
  const username = localStorage.getItem("username");
  return (
    <div className="main-screen">
      <img
        src={backgroundImage}
        className="main-screen-image"
        alt="background image"
      />
      <div className="main-screen-title-container">
        <h2 className="greetings">Have a good day, {username}!</h2>
        <h4 className="wishes">Add a task to make your day more productive!</h4>
      </div>
    </div>
  );
}

export default MainScreen;
