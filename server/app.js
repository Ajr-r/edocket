const exp=require('express')
const xl=require('xlsx-populate')
const bodyParser = require('body-parser');
const cors = require('cors');
const app=exp()
const path=require('path')
const compression=require('compression');
const {add}=require('./middleware/mongodb.js')
const {find}=require('./middleware/find.js')
const {del}=require('./middleware/del.js')



app.use(exp.json())
app.use(compression({
    level:9,
    threshold:100,
    filter:(req,res)=>{
      if(req.header['x-no-compression'])return false
      return compression.filter(req,res)
    }
  }))
app.use(cors({
    origin: '*',
    optionsSuccessStatus: 200,
}));
app.use(exp.static(path.join(__dirname, '../client/public')));


  let lookup={}
let sname=new Set();
let sup,po=["",""]

//parsing the excel file
fetch('https://drive.google.com/uc?export=download&id=1mWI8aXkWltjK-rH8cHT1cF7qYs0wYUSx')
.then(r=>r.arrayBuffer())
.then((r)=>{
   
    
    xl.fromDataAsync(r)
    .then(w=>{
        const sheet=w.sheet(0)
        const data=sheet.usedRange().value();
        data.forEach((i)=>{
            if(i[11]!==undefined){
                sup=i[11]     
                sname.add(sup)
            }
            if(lookup.hasOwnProperty(sup)){
                lookup[sup].push({[i[15]]:i[2]})
        }
        else{
            
            lookup[sup]=[{[i[15]]:i[2]}]
        }
    })
    sname.delete('Supplier')
    sname=[...sname].sort()
    // console.log(sname)
    // console.log(lookup)
})
.catch(()=>console.log('error occured while parsing excel file'))

}
)

app.get('/api/list',(req,res)=>{
    res.header('Content-Type', 'application/json');
    res.header('Cache-Control', 'public, max-age=3600');
    res.send([...sname])
})
app.get('/api/po',(req,res)=>{
    res.header('Content-Type', 'application/json');
    res.header('Cache-Control', 'public, max-age=3600');
    res.send(lookup[req.query.id])    
})

app.post('/api/add',(req,res)=>{
    let {formData}=req.body
        add(formData)
        .then(()=>
        res.send('pass')
        )
        .catch(()=>res.send('failed'))
    
})
app.get('/api/l',(req,res)=>{
    res.send('hello')
})
app.get('/api/find',(req,res)=>{
    find(req.query.name)
    .then((r)=>{
       
        res.send(r)
    }).catch((e)=>{
        console.log(e)
        res.status(500)
    })
    
})
app.get('/api/del',(req,res)=>{
    // console.log(req.query.id)


        del(req.query.id)
        .then((r)=>{

            // console.log(r)
            if(r==1)res.send('Docket deleted')
            else res.send('No records found')
        })
        .catch((e)=>{
            console.log(e)
            res.send('unsuccsful')
        })
 
    
})


app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/public/index.html'));
});


app.listen(3000,()=>{
    console.log('server started')
})
