const express = require('express');
const app = express();
const fileUpload = require('express-fileupload');
const pdfParse = require('pdf-parse');
const path = require("path");
const port = 4000;
const toPdf = require('html-pdf');
const bodyParser = require('body-parser');

app.use('/', express.static('public'));
app.use(fileUpload()); 
app.use(express.json());
app.use(bodyParser.json());

app.post('/', (req, res) => {

    if(!req.files && !req.files) {
        res.status(400);
        res.end(); 
    }

//extract pdf data and send to the frontend
        pdfParse(req.files.pdfFile).then(result => {
            res.send(result.text);
        const edited = req.files.pdfFile;

// to name the file with uploading date & time    
        var d = new Date();
        var fileName = [d.getFullYear()]+ '0'+[d.getMonth()+1]+ [d.getDate()] + [d.getHours()]+ [d.getMinutes()] + [d.getSeconds()] + '.pdf'; // edited.name -> to get exact name(no need for add .pdf)

// upload file to the target folder
        edited.mv(path.join(__dirname, 'Old files', fileName), (err) => {
            if(err) {
                res.send(err)
            } 
        });
    }); 
});

// to upload the edited pdf
app.post('/upload', (req, res) => {
    var data = req.body.text;
    
    var options = { format : "Letter"};

    toPdf.create(data, options).toFile('./New files/' + new Date().getFullYear() + new Date().getMonth() + new Date().getDate() + new Date().getHours() + new Date().getMinutes() + new Date().getSeconds() + '.edited.pdf' , function(err, res) {
        if (err)
        return console.log(err);
        /** old file name and new file name are not same
         * named on the basis of upload date & time
         */
        
        
    })
})

app.listen(port,() => {
    console.log(`Server running on ${port}...`);
});
