module.exports = {
    port: 3000,
    mongodb: {
        host: "localhost",
        port: 27017,
        username: "",
        password: "",
        database: "firstapp"
    },
    logs: [
        { "level": "info", "output": "./log/" },
        { "level": "info", "output": "stdout" }
    ],
    enroll_status: {
        0 : '报名成功',
        1 : '待支付',
        2 : '待审核', 
    }
};