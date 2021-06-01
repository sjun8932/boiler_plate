const mongoose = require('mongoose'); // mongoose란 mongoDB라는 NoSQL 데이터베이스를 지원하는 노드의 확장모듈이다.
const bcrypt = require('bcrypt'); //bcrypt 모듈을 설치했으니 가져와야 한다.
const saltRounds = 10; // 생성될 salt의 크기를 정해준다.
const jwt = require('jsonwebtoken'); // jsonwebtoken 모듈 가져오기

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true, // 데이터의 빈칸을 없애주는 용도 여기서는 email 데이터겠지..
        unique: 1,
    },
    password: {
        type: String,
        minlength: 5
    },
    lastnmae: {
        type: String,
        minlength: 5
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    
    token: {
        type: String,
    },
    tokenExp: {
        type: Number,
    }
})

userSchema.pre('save', function( next ){ //pre는 mongoose에서 가져온 메서드이고 User 모델에 user 정보를 저장하기 전에 (save함수) 사전 작업을 해준다는 메서드 입니다.
    var user = this;

    if(user.isModified('password')){
        //비밀번호를 암호화 시키는 구역

        bcrypt.genSalt(saltRounds,function(err,salt){
            if(err) return next(err)

            bcrypt.hash(user.password ,salt, function(err, hash){ // 여기서 user.password는 plainpassword를 담당 
                if(err) return next(err)
                user.password = hash // user.password를 hash된 값으로 변경
                next() 
            })
        })
    } else {
        next()
    }

}); 


userSchema.methods.comparePassword = function(plainpassword, cb) {

    //painpassword 1234567 암호화된 비밀번호 #44%^s55334#2d&ss와 맞는지 확인
    bcrypt.compare(plainpassword, this.password, function(err, isMatch){
        if(err) return cb(err);
            cb(null, isMatch)
    })

}

userSchema.methods.generateToken = function(cb) {

    var user = this;

    // jsonwebtoken을 이용해서 token을 생성하기

    var token = jwt.sign(user._id.toHexString(), 'myToken')

    // user._id + 'secretToken' = token ,,,,,,,  user._id + 토큰애칭 = 토큰
    // ->
    // 토큰 애칭인 'secretToken'을 입력하면  -> user._id가 나오게

    user.token = token
    user.save(function(err,user){
        if(err) return cb(err)
        cb(null, user)
    })
}

userSchema.statics.findByToken = function(token, cb){
    var user = this;

    //토큰을 decode 한다.

    jwt.verify(token, 'myToken', function (err, decoded){
        // 유저 아이디를 이용해서 유저를 찾은 다음에
        // 클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인

        user.findOne({"_id": decoded , "token": token}, function(err,user){

            if(err) return cb(err)
            cb(null, user)
        })
    })


}

const User = mongoose.model('User', userSchema) // "모델"이란 개념은 "스키마"를 감싸는 용도

module.exports = { User } // 다른 js 파일에서도 모듈을 쓰기 위한 작업이라고 보면 된다.