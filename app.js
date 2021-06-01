const express = require("express")
const bodyParser = require("body-parser")
const request = require("request")
const https = require("https")
const { post } = require("request")
const { response } = require("express")

const app = express()

app.use(express.static("public"))

app.use(bodyParser.urlencoded({extended: true}))

app.get("/",function(req,res){
    res.sendFile(__dirname + "/signup.html")
})
app.post("/",function(req,res){
    const firstname = req.body.fName
    const lastname = req.body.password
    const email = req.body.email
    
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstname,
                    LNAME: lastname
                }
            }
        ]
    }
    const jsonData = JSON.stringify(data);

    const url = "https://us6.api.mailchimp.com/3.0/lists/4f5c976541";

    const options = {
        method: "post",
        auth: "jayakumar:64661b6e6f0b793b22278f92a98a1d20-us6"
    }




    const request = https.request(url, options, function(response){


                if(response.statusCode === 200){
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }


        response.on("data",function(data){
            console.log(JSON.parse(data));
        })
    })
    request.write(jsonData);
    request.end();
})

/* weather API */

app.post("/success.html",function(req,res){

   const query = req.body.cityName;
   const apiKey = "a94b04ddce127b76fdbf54ef74d81e4a";
   const unit = "metric"
   const url ="https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + unit;
   https.get(url,function(response){
       console.log(response.statusCode);

       response.on("data",function(data){
           const weatherData = JSON.parse(data);
           const temperature = weatherData.main.temp;
           const description = weatherData.weather[0].description;
           const icon = weatherData.weather[0].icon;
           const imageurl = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
           res.write("<h1>The weather in " + query + " is " + temperature + " degrees Celcius.</h1>");
           res.write("<h3>The weather is currently " + description+"</h3>");
           res.write("<img src = "+ imageurl +">");
           res.send();
       })
   });
})

/* Redirection */ 

app.post("/failure",function(req,res){
    res.redirect("/")
})

app.listen(process.env.PORT || 4000,function(){
    console.log("Server is running on port 4000")
})
