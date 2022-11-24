var express = require("express");
var app = express();
var data_prep = require("./data_prep");
const exphbs = require('express-handlebars');


app.engine('.hbs', exphbs.engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');
app.set('views', './views');
app.use(express.urlencoded({ extended: true }));

var HTTP_PORT = process.env.PORT || 8080;
function onHttpStart() {
    console.log("Express http server listening on " + HTTP_PORT);
}



app.get("/", (req, res) => {
    /*let resText = "<h2>Declaration (text size in heading 2): </h2> ";
    resText += "<p> The rest text is displayed in paragraph as shown in screenshot. </p>";
    resText += " <p> I acknowledge the College’s academic integrity policy – and my own integrity ";
    resText += "- remain in effect whether my work is done remotely or onsite.";
    resText += " Any test or assignment is an act of trust between me and my instructor, ";
    resText += " and especially with my classmates… even when no one is watching.";
    resText += " I declare I will not break that trust. </p>";
    resText += "<p>Name: <mark> <b> Het Patel </b> </mark> </p>";
    resText += "<p>Student Number: <mark><b> 154671218 </b> </mark> </p>";

    resText += `<p> <a href = "/CPA"> Click to visit CPA Students </a></p>
                <p> <a href = "/highGPA"> Click to see who has the highest GPA </a></p>
                <p> <a href = "/allStudents"> All students </a></p>
                <p> <a href = "/addStudent"> Add a student </a></p>
                <p> Note : Locate specific student by student ID eg. http://localhost:8080/student/1 </p>`;
    res.send(resText);
    */
    res.render('home', {

    });
});

app.get("/CPA", (req, res) => {
    data_prep.cpa().then((data) => {
        res.render('students', {
            students: data
        });
    }).catch((reason) => {
        res.json({ message: reason });
    });
});

app.get("/highGPA", (req, res) => {
    data_prep.highGPA().then((data) => {
        res.render('student', {
            student: data
        });
    });
});

app.get("/allStudents", (req, res) => {
    data_prep.allStudents().then((data) => {
        res.render('students', {
            students: data
        });
    }).catch((reason) => {
        res.json({ message: reason });
    });
});

app.get("/addStudent", (req, res) => {
    res.sendFile(__dirname + "/test3_views/addStudent.html");
});

app.post("/addStudent", (req, res) => {
    let student = req.body;
    data_prep.addStudent(student).then((data) => {
        res.render('student', {
            student
        });
    }).catch((reason) => {
        res.json({ message: reason });
    });
});

app.get("/student/:studId", (req, res) => {
    data_prep.getSudent(req.params.studId).then((data) => {

        res.render('student', {
            student: data
        });
    }).catch((reason) => {
        res.json({ message: reason });
    });
});

app.get("*", (req, res) => {
    res.status(404).send("Error 404: page not found.")
})

data_prep.prep().then((data) => {
    //console.log(data);
    app.listen(HTTP_PORT, onHttpStart);
}).catch((err) => {
    console.log(err);
});