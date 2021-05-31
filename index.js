const express = require('express')
const app = express();
const port = 5000

const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://sangjun:Itsme2020!@jun.mkfsp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false // 7번줄은 갖가지 에러 방지용 설정이니 잘 몰라도 상관 없다.
}).then(() => console.log("연결이 성공하였습니다."))
  .catch(err => console.log(err))

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`));