const axios = require("axios")

axios.post("https://platform.acadima.tech/auth/register", 
    {
        "full_name" : "hrasd77 aaa",
        "email": "h7733@gmail.com",
        "email_confirmation": "h7733@gmail.com",
        "password": "password",
        "type": "programs",
        "password_confirmation": "password",
        "mobile"  : "4457127612948",
        "country_code": "EG",
        "webinar_id": "programs",
        "bundle_id": "courses"
    }
  )
  .then(function(response) {
    console.log("Response:", response.data);
  })
  .catch(function(error) {
    console.error("There was an error!", error);
  });
 