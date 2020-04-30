const {db} = require('./../connection')

module.exports = {
    getstore: (req,res) => {
        /*^*/db.query('select * from store',(err,result)=>{   // param pertama isi query-nya (cara tulis mysql), param ke-2, call back, result dr db.query
            if(err) return res.status(500).send(err)            // kalau if hanya 1 baris, bisa dipersingkat tak usah pakai {}
            return res.status(200).send(result)
        })           
    },
    tambahstore: (req,res) =>{
        const {branch_name}=req.body
        var sql='insert into store set ?'
        db.query(sql,req.body,(err,result)=>{
            if(err) res.status(500).send(err)
            sql='select * from store'
            db.query(sql,(err,result1)=>{
                if(err) res.status(500).send(err)
                res.status(200).send(result1)
            })
        })

    },
    editstore: (req,res) => {
        const {id}= req.params
        var sql=`update store set ? where store_id=${id}`
        db.query(sql,req.body,(err,result)=>{           // req.body??
            if(err) return res.status(500).send(err)
            db.query('select * from store',(err,result2)=>{
                if(err) return res.status(500).send(err)
                return res.status(200).send(result2[0])
            })
        })  
    },
    deletestore: (req,res) =>{
        const {id}=req.params//req.params.id
        // var sql=`select * from store where store_id=${id}`
        var sql=`select * from store where store_id=${id}`
        db.query(sql,(err,result)=>{
            if (err) res.status(500).send(err)
            if(result.length){
                var sql=`delete from store where store_id=${id}`
                db.query(sql,(err,result2)=>{
                    if (err) res.status(500).send(err)
                    var sql=`select * from store`
                    db.query(sql,(err,result3)=>{
                        if (err) res.status(500).send(err)
                        return res.status(200).send(result3[0])
                    })
                })
            }else{
                return res.status(500).send({message:'terjadi error'})
            }
        })
    }
}

