const { Router } = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../modle/user'); // Corrected typo in model name
const { log } = require('console');

const router = Router();

router.post('/register', async function(req, res) {
    let { name, password, email } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(password, salt);

    const record = await User.findOne({ email: email }); // Corrected variable name

    if (record) {
        res.status(400).send({
            message: "email already present"
        });
    } else {
        const newUser = new User({ // Corrected variable name and added missing declaration
            name: name,
            password: hashedpassword,
            email: email
        });

        const result = await newUser.save();

        res.send({
            message: "successful registration"
        });
    }
});

router.post('/login', async function(req, res) {
    let {password, email } = req.body;

    

    const record = await User.findOne({ email: email });

    if(!record){
        res.status(404).send({
            message:"user not found"
        })
    }


    const validPassword = await bcrypt.compare(password, record.password);
    if (!validPassword) {
        return res.status(401).send({
            message: "Invalid password"
        });
    }
                
        const { _id } = await record.toJSON();
        const token = await jwt.sign({ _id: _id }, "secret");

        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });
        res.send({
            message: "successful login"
        });
    }
);

router.get('/user', async function(req, res) {
    try {
        const token = req.cookies.jwt; // Corrected token retrieval
        if (!token) {
            return res.status(401).send({
                message: "user not authenticated"
            });
        }

        const claim = jwt.verify(token, "secret");
        if (!claim) {
            console.log("error mila");
            return res.status(401).send({
                message: "user not authenticated"
            });
            
        }

        const user = await User.findOne({ _id: claim._id });
        if (!user) {
            console.log('user id nhi mili');
            return res.status(401).send({
                message: "user not authenticated"
            });
        }

        const { password, ...data } = await user.toJSON();
        res.send(data);

    } catch (err) {
        console.error("pure me hi error hai");
        return res.status(401).send({
            message: "authentication failed"
        });
    }
});


router.post('/logout', async (req, res) => {
   res.cookie('jwt',"",{maxAge:0})

   res.send({
    message:'succesfull logout'
   })
});

module.exports = router;