const express = require('express')
const app = express();
const port = 5000
//const bodyParser = require('body-parser'); // Package에서 설치했던 body-parser를 가져온다.
// express 4.16 이하 버전에서는 4번줄과 같이 bodyParser 변수를 만들고 해야됨.

const { User } = require("./models/User"); // User.js에서 User 모델을 가져오는 작업

app.use(express.urlencoded({extended: false}));
//app.use(bodyParser.urlencoded({extended: true})); // application/x-www-form-urlencoded 형식의 데이터를 분석해서 가져올 수 있게 해주는 코드이다. express 4.16 이하 버전

app.use(express.json());
//app.use(bodyParser.json()); //application json 형식으로 된 파일을 분석할 수 있게 해주는 코드 express 4.16 이하 버전


const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://sangjun:Itsme2020!@jun.mkfsp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false // 7번줄은 갖가지 에러 방지용 설정이니 잘 몰라도 상관 없다.
}).then(() => console.log("연결이 성공하였습니다."))
  .catch(err => console.log(err))

app.get('/', (req, res) => res.send('Hello World!'))

app.post('/register', (req, res) => {

    // 회원 가입을 할 때 필요한 정보들을 client에서 가져오면
    // 그것들을 데이터 베이스에 넣어준다.
    const user = new User(req.body) // 인스턴스 생성

    user.save((err, userInfo) => {

        if(err) {return res.json({ success: false, err})}
        
            return res.status(200).json({success: true}) // status(200)은 연결에 성공했을 때를 의미한다.

    })

})


app.listen(port, () => console.log(`Example app listening on port ${port}!`));