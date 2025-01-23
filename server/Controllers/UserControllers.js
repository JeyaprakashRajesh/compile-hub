
async function getUserDetails(req, res) {
    try {
      const email = req.decoded_data.email;
      console.log(email);
  
      const user = {
        email: email,
        name: "John Doe", 
      };
  
      res.status(200).json(user);
    } catch (err) {
      console.error("Error fetching user details:", err);
      res.status(500).json({ message: "Server error." });
    }
  }
  
  module.exports = {
    getUserDetails,
  };
  