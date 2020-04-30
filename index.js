const express   = require ('express')
const bodyparser= require('body-parser')
const app       = express()
var cors        = require ('cors')

const PORT      = 4000

app.use(cors())    
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended:false}))
app.use(express.static('public'))

app.get('/',(req,res)=>res.send('<h1>Welcome to Ujian Back_End JC12</h1>'))
const {allProductRouters, allStoreRouters, allInventoryRouters} = require ('./routers')

// app.use('/foto', allFotoRouters)              
app.use('/product', allProductRouters) 
app.use('/store', allStoreRouters) 
app.use('/inventory', allInventoryRouters) 


// app.get('/users',(req,res)=>{
//     const {id} = req.query
//     if(!id){                // if req.queru.id = undefined(/tidak ada)
//         db.query('select * from pengguna',(err,result)=>{
//             if(err) res.status(500).send(err)
//             result[0].kelas='jc12'                          // bisa dicustomize asal sblm res.send
//             res.send(result)
//         })
//     }else{
//         db.query('select * from pengguna where id=?'[req.query.id],(err,result)=>{
//             if(err) res.status(500).send(err)
//             res.send(result[0])
//         })
//     }
// })
app.listen(PORT, ()=>console.log('sudah berjalan di port ' + PORT))