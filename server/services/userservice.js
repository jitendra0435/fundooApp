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
}
module.exports=new userS();