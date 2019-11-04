const model=require('../model/usermodel');

class userS{

register(body,callback) 
 {
  model.register(body,(err,data)=>{
   if(err)
      callback (err);
      else
       callback (null,data);

 })
}
login(body,callback)
{
      model.login(body,(err,data)=>{
            if(err)
             callback(err)
             else
              callback(null,data)
      })
}
varifyEmail(body,callback)
{
      model.varifyEmail(body,(err,data)=>{
            if(err)
                  callback(err);
            else
             callback(null,data);
      })    
}

}
module.exports=new userS();