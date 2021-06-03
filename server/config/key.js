if(process.env.NODE_ENV === 'production'){
    module.expors = require('./prod.js');
} else {
    module.exports = require('./dev.js')
}