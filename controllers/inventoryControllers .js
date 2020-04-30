const {db} = require('./../connection')

module.exports = {
    getinventory:(req,res)=>{
        var sql='select p.nama , s.branch_store from inventory i join product p on i.product_id = p.product_id join store s on i.store_id = s.store_id;'
        db.query(sql,(err,result)=>{
            if(err) res.status(500).send(err)
            res.status(200).send(result)
        })
    },
    editinventory: (req,res) => {
        const {id}= req.params
        var sql=`update inventory set ? where inventory_id=${id}`
        db.query(sql,req.body,(err,result)=>{           // req.body??
            if(err) return res.status(500).send(err)
            db.query('select * from inventory',(err,result2)=>{
                if(err) return res.status(500).send(err)
                return res.status(200).send(result2[0])
            })
        })  
    },
    deleteinventory:(req,res)=>{
        const{id}=req.params
        var sql=`delete from inventory where inventory_id=${id}`
        db.query(sql,(err,result)=>{
            if(err) res.status(500).send(err)
            var sql='select * from inventory'
            db.query(sql,(err1,result1)=>{
                if(err1)res.status(500).send(err1)
                res.status(200).send(result1)
            })
        })
    },
}

