require('dotenv').config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

//ejs
app.set('view engine', 'ejs');

//express
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

//mongo 


// const url = "mongodb://localhost:27017";
//create your clster and put it in url below or use above url for localhost
 const url = "mongodb+srv://"+CLUSTER_USERNAME+":"+CLUSTER_pswd+"@cluster1.amwr9.mongodb.net";
mongoose.connect(url+"/tsfBank", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


const customersSchema = {
    sr: Number,
    name: String,
    email: String,
    money: Number
};

const Customer = mongoose.model("Customer", customersSchema);


const historySchema = {
    sender : String,
    reciver : String,
    amount : Number,
    date : String
}

const History = mongoose.model("History", historySchema);

const customer1 = new Customer({
    sr: 1,
    name: "Shubham Persia",
    email: "persia@gmail.com",
    money: 50000
});

const customer2 = new Customer({
    sr: 2,
    name: "Ankur Meena",
    email: "ankur@gmail.com",
    money: 55000
});
const customer3 = new Customer({
    sr: 3,
    name: "Amey Wankhede",
    email: "amey@gmail.com",
    money: 60000
});
const customer4 = new Customer({
    sr: 4,
    name: "Vibhor Goyal",
    email: "vibhor@gmail.com",
    money: 65000
});
const customer5 = new Customer({
    sr: 5,
    name: "Yash Gandhi",
    email: "gandhi@gmail.com",
    money: 70000
});
const customer6 = new Customer({
    sr: 6,
    name: "Tanmay Rathi",
    email: "tanmay@gmail.com",
    money: 75000
});
const customer7 = new Customer({
    sr: 7,
    name: "Devashish Beniwal",
    email: "devashish@gmail.com",
    money: 80000
});
const customer8 = new Customer({
    sr: 8,
    name: "Vipul",
    email: "vipul@gmail.com",
    money: 85000
});
const customer9 = new Customer({
    sr: 9,
    name: "Maneet Gandhi",
    email: "maneet@gmail.com",
    money: 90000
});
const customer10 = new Customer({
    sr: 10,
    name: "Parth Gaud",
    email: "parth@gmail.com",
    money: 95000
});


//endpoints
app.get("/", function (req, res) {
    res.render("home");
});

const cust = [customer1, customer2, customer3, customer4, customer5, customer6, customer7, customer8, customer9, customer10];


app.get("/customers", function (req, res) {
    
    Customer.find({}, function (err, foundCustomers) {

        if (foundCustomers.length === 0) {
            Customer.insertMany(cust, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("success");
                }
            });
            res.redirect("/customers");
        } else
            res.render("customers", {
                customers: foundCustomers
            });
    })

});


app.get("/customers/:customerID", function (req, res) {
    const requestedId = req.params.customerID;


    Customer.find({}, function (err, foundCustomers) {

        Customer.findOne( { _id : requestedId }, function (err, docs) {
            if (err){
                console.log(err)
            }
            else{
                res.render("transaction", {
                    sender: requestedId,
                    name : docs.name,
                    email : docs.email,
                    money : docs.money,
                    customers: foundCustomers
                });
            }
        });
        
    });
});


app.get("/history",function(req,res){

    History.find({}, function (err, foundHistory) {
    res.render("history", {
        history : foundHistory
    });
})
})

app.post("/transaction", function (req, res) {
    
    const senderID = (req.body.sender);
    const reciverID = (req.body.person);
    const Amount = Number(req.body.Amount);

    if(Amount>0){
    Customer.findOne({
        _id: senderID
    }, function (err, cust) {
        var senderName = cust.name;
        if (!err) {
            if (cust.money >= Amount) {
                Customer.updateOne({
                    _id: senderID
                }, {
                    money: (cust.money - Amount)
                }, function (err, docs) {
                    if (err) {
                        console.log(err);
                        res.redirect("/customers")
                    } else {
                        console.log("Updated Docs : ", docs);      
                    }
                });

                Customer.findOne({
                    _id: reciverID
                }, function (err, rec) {
                    var reciverName = rec.name;
                    if (!err) {

                        Customer.updateOne({
                            _id: reciverID
                        }, {
                            money: (rec.money + Amount)
                        }, function (err, docs) {
                            if (err) {
                                console.log(err);
                                res.redirect("/customers")
                            } else {
                                console.log("Updated Docs : ", docs);
                            }
                        });
                    }
                    const Today = new Date();
                    const history = new History({
                        sender :senderName,
                        reciver : reciverName,
                        amount : Amount,
                        date : Today.toLocaleDateString() +" "+ Today.toLocaleTimeString()
                    });
                    history.save();
                });

            }
            
        }
    });}
    res.redirect("/customers");
})


//port live server
let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
