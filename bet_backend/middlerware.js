const jwt = require("jsonwebtoken");
const jwt_key = "bets";
const Verifytoken = (req, resp, next) => {
    let tok = req.headers['authorization'];
    if (tok) {
        // tok=tok.split(' ')[1];
        jwt.verify(tok, jwt_key, (err, valid) => {
            if (err) {
                resp.send("Please add token valid");
            }
            else {
                next();
            }
        })
    }
    else {
        resp.send("Please add token");
    }
}

module.exports={Verifytoken}