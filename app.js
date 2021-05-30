const bodyParser = require("body-parser")

const express = require("express");

const https = require("https");

var app = express();

app.use(express.static("static"))
app.use(bodyParser.urlencoded({extended:true}))


app.get("/", (req,res) => {
    path = __dirname + "/signup.html";
    res.sendFile(path)
})


app.post("/", (req,res) => {
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var email = req.body.email;

    var data = {
        "email_address" : email,
        "status":"subscribed",
        "merge_fields":{
            "FNAME" : firstname,
            "LNAME" : lastname
        }
    };

    var jsonData = JSON.stringify(data);

    // ?skip_merge_validation=<SOME_BOOLEAN_VALUE>
    
    var url = 'https://us1.api.mailchimp.com/3.0/lists/74bc7e4f00/members'

    var options = {
        method: "POST",
        auth: "Akhil:0b5d892edac434e264ed3d71d709b87f-us1"
    }

    const request = https.request(url, options, (response) => {

        if(response.statusCode == 200){
            res.sendFile(__dirname+"/success.html");
        } else {
            res.sendFile(__dirname+"/failure.html");
        }

        response.on("data", (data) => {
            console.log(JSON.parse(data));
        });
    });

    request.write(jsonData);
    request.end();
})

app.post("/failure", (req,res) => {
    res.sendFile(__dirname + "/signup.html")
})

app.listen(process.env.PORT || 3000, () => {
    console.log("server is running on port 3000")
})


// Api key
// 0b5d892edac434e264ed3d71d709b87f-us1

// Unique ID
// 74bc7e4f00