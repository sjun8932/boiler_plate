const mongoose = require('mongoose'); // mongoose란 mongoDB라는 NoSQL 데이터베이스를 지원하는 노드의 확장모듈이다.

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

const User = mongoose.model('User', userSchema) // "모델"이란 개념은 "스키마"를 감싸는 용도

module.exports = { User } // 다른 js 파일에서도 모듈을 쓰기 위한 작업이라고 보면 된다.