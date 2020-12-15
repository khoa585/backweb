require("dotenv").config();
let { find_, getLinkgetLink,getDetialComic } = require("./getList");
const redis = require("redis");
var Redis = require('ioredis');
var kue = require('kue');

const client = redis.createClient();
let queue = kue.createQueue({
    redis: {
        createClientFactory: function () {
            return new Redis();
        }
    },
});

let mongoose = require("mongoose");
try {
    mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true }, (error) => {
        if (error) {
            console.log(error);
        } else {

            console.log("Connected to DB");
        }
    });
} catch (error) {
    console.log(error);
}
client.flushdb( function (err, succeeded) {
    console.log("Xóa Thành Công :" + succeeded); // will be true if successfull
});

 
// for (let i = 1; i <= 5; i++) {
//     let job = queue.create("getLinkCommic", i).attempts(3).save(function (error) {
//         if (!error) console.log(job.id);
//         else console.log(error);
//     });
// }

// queue.process("getLinkCommic", 8, function (job, done) {
//     getLinkgetLink(job.data).then((data) => {
//         console.log("page " + job.data + " : " + data);
//         done()
//     })
//         .catch(error => {
//             console.log(error);
//         })
// })



find_().then((data) => {
    data.forEach((item) => {
        let job = queue.create('getDetailCommic', { url: item.url, id: item._id }).save(function (error) {
            if (!error) console.log(job.id);
            else console.log(error);
        });
    })
}).catch((error) => {
    console.log(error)
})
queue.process("getDetailCommic",6, function(job,done){
    getDetialComic(job.data.url,job.data.id).then((data)=>{
     console.log(data);
        done()
    }).catch(error=>{
        console.log(error);
    })
})
