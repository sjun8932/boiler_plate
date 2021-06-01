const mongoose = require('mongoose'); // mongoose란 mongoDB라는 NoSQL 데이터베이스를 지원하는 노드의 확장모듈이다.
const bcrypt = require('bcrypt'); //bcrypt 모듈을 설치했으니 가져와야 한다.
const saltRounds = 10; // 생성될 salt의 크기를 정해준다.

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
        type: String
    },
    tokenExp: {
        type: Number
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
    }

}); 

const User = mongoose.model('User', userSchema) // "모델"이란 개념은 "스키마"를 감싸는 용도

module.exports = { User } // 다른 js 파일에서도 모듈을 쓰기 위한 작업이라고 보면 된다.