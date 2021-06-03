const express = require('express')
const app = express();

const cookieParser = require('cookie-parser');
const config = require('./config/key');
const { auth } = require('./middleware/auth')
const { User } = require("./models/User"); // User.js에서 User 모델을 가져오는 작업

app.use(express.urlencoded({extended: false}));
//app.use(bodyParser.urlencoded({extended: true})); // application/x-www-form-urlencoded 형식의 데이터를 분석해서 가져올 수 있게 해주는 코드이다. express 4.16 이하 버전


//const bodyParser = require('body-parser'); // Package에서 설치했던 body-parser를 가져온다.
// express 4.16 이하 버전에서는 4번줄과 같이 bodyParser 변수를 만들고 해야됨.
app.use(express.json());
//app.use(bodyParser.json()); //application json 형식으로 된 파일을 분석할 수 있게 해주는 코드 express 4.16 이하 버전

app.use(cookieParser());

const mongoose = require('mongoose');
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false // 7번줄은 갖가지 에러 방지용 설정이니 잘 몰라도 상관 없다.
}).then(() => console.log("MongoDB 연결이 성공하였습니다."))
  .catch(err => console.log(err))

app.get('/', (req, res) => res.send('햄버거가 먹고픈 날'))

app.get('/api/hello', (req, res) => {
    res.send("안녕하세요 ~ ")
}) 

app.post('/api/users/register', (req, res) => {

    // 회원 가입을 할 때 필요한 정보들을 client에서 가져오면
    // 그것들을 데이터 베이스에 넣어준다.
    const user = new User(req.body) // 인스턴스 생성

    user.save((err, userInfo) => {

        if(err) {return res.json({ success: false, err})}
        
            return res.status(200).json({success: true}) // status(200)은 연결에 성공했을 때를 의미한다.

    })

})

app.post('/api/users/login', (req, res) => {

    // 요청된 이메일을 데이터베이스에서 있는지 찾는다.
    User.findOne({ email: req.body.email }, (err, user) => {

        if (!user) {
            return res.json({
                loginSuccess: false,
                message: "제공된 이메일에 해당하는 유저가 없습니다."
            })
        }

    // 요청된 이메일이 데이터 베이스에 있다면 비밀번호가 맞는 비밀번호인지 확인,

        user.comparePassword(req.body.password , (err, isMatch) => {
            if(!isMatch)
            return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다."})

            // 비밀번호까지 맞다면 토큰을 생성하기.
            user.generateToken((err, user)=> {
                if(err) return res.status(400).send(err);

                // 토큰을 저장한다. 어디에 ? 쿠키 또는 로컬 스토리지에 저장 가능함
                        res.cookie("x_auth", user.token)
                        .status(200)
                        .json({ loginSuccess: true, userId: user._id}) 

            })


        })
    }) // findOne()은 몽고DB에서 제공하는 메서드
})

app.get('/api/users/auth', auth , (req, res) => { // 여기서 auth는 미들웨어로 리퀘스트를 받은 후에 콜백 함수를 진행하기 전에 중간작업이라고 보면 된다. 
    
    // 여기 까지 미들웨어를 통과해 왔다는 얘기는 Authenticaion이 true라는 말
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image 
    })
})

app.get('/api/users/logout', auth, (req, res) => {

    console.log('req.user', req.user)

    User.findOneAndUpdate({ _id: req.user._id },

        { token: "" }
          
           
        , (err, user) => {

            if (err) return res.json({ success: false, err });

            return res.status(200).send({

                success: true

            })

        })

})

const port = 5000;

app.listen(port, () => console.log(`Example app listening on port ${port}!`));