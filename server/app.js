const exp = require('express')
const xl = require('xlsx-populate')
const bodyParser = require('body-parser');
const cors = require('cors');
const app = exp()
const path = require('path')
const compression = require('compression');
const { add } = require('./middleware/mongodb.js')
const { find } = require('./middleware/find.js')
const { del } = require('./middleware/del.js')
const fs = require('fs')


app.use(exp.json())
app.use(compression({
    level: 9,
    threshold: 100,
    filter: (req, res) => {
        if (req.header['x-no-compression']) return false
        return compression.filter(req, res)
    }
}))
app.use(cors({
    origin: '*',
    optionsSuccessStatus: 200,
}));
app.use(exp.static(path.join(__dirname, '../client/public')));


let lookup = {}
let sname = new Set();
let sup = ""
let flag = false

//parsing the excel file
let j_data = {};
function parse() {

    fetch('https://drive.google.com/uc?export=download&id=1mWI8aXkWltjK-rH8cHT1cF7qYs0wYUSx')
        .then(r => r.arrayBuffer())
        .then((r) => {
            xl.fromDataAsync(r)
                .then(w => {
                    sname=new Set()
                    const sheet = w.sheet(0)
                    const data = sheet.usedRange().value();
                    data.forEach((i) => {
                        if (i[11] !== undefined) {
                            sup = i[11]
                            // console.log(sname)
                            sname.add(sup)
                        }
                        if (lookup.hasOwnProperty(sup)) {
                            lookup[sup].push({ [i[15]]: i[2] })
                        }
                        else {

                            lookup[sup] = [{ [i[15]]: i[2] }]
                        }
                    })
                    sname.delete('Supplier')
                    sname = [...sname].sort()
                    // console.log('excel file parsed')
                    // console.log(sname)
                    // console.log(lookup)
                    j_data['sname'] = sname;
                    j_data['lookup'] = lookup;
                    try {

                        fs.writeFile('./db/db.json', JSON.stringify(j_data), 'utf8', () => { })
                        flag = true
                        console.log('excel file parsed and json file written')
                    }
                    catch (e) {
                        console.log('error in json write', e)
                    }
                })
                .catch((e) => console.log('error occured while parsing excel file' + e))
        }
        )
}
parse()


function read() {
    try {
        const data = fs.readFileSync('./db/db.json', 'utf8');
        const jsonData = JSON.parse(data);
        sname = jsonData['sname'];
        // console.log('sname type:', typeof sname);
        // console.log('sname data:', sname);
        lookup = jsonData['lookup'];
        console.log('JSON data read successfully:');
        flag = true
    } catch (err) {
        console.error('Error reading or parsing JSON file:', err);
    }
}

app.get('/api/list', (req, res) => {
    // parse()
    if (!flag) read()

    res.header('Content-Type', 'application/json');
    console.log('sending list data')
    // res.header('Cache-Control', 'public, max-age=3600');
    res.send([...sname])

})


app.get('/api/po', (req, res) => {
    if (!flag) read()

    res.header('Content-Type', 'application/json');
    res.header('Cache-Control', 'public, max-age=3600');
    res.send(lookup[req.query.id])

})

app.post('/api/add', (req, res) => {
    let { formData } = req.body
    add(formData)
        .then(() =>
            res.send('pass')
        )
        .catch(() => res.send('failed'))

})
app.get('/api/l', (req, res) => {
    res.send('hello')
})
app.get('/api/find', (req, res) => {
    find(req.query.name)
        .then((r) => {

            res.send(r)
        }).catch((e) => {
            console.log(e)
            res.status(500)
        })

})
app.get('/api/del', (req, res) => {
    // console.log(req.query.id)


    del(req.query.id)
        .then((r) => {

            // console.log(r)
            if (r == 1) res.send('Docket deleted')
            else res.send('No records found')
        })
        .catch((e) => {
            console.log(e)
            res.send('unsuccsful')
        })


})
app.get('/refresh',(req,res)=>{
        parse()
        res.status(200)
        res.send('completed')
 
})

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/public/index.html'));
});


app.listen(3000, () => {
    console.log('server started')
})
