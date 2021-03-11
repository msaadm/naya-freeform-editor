const express = require("express")
const User = require("./models/User")
const Sketch = require("./models/Sketch")
const router = express.Router()

// Get all users
router.post("/users", async (req, res) => {
    // console.log(req.body)
    const users = await User.find({ name: req.body.username })
    if (Array.isArray(users) && !users.length == 0) {
        res.send(users[0])
    } else {
        const userCreated = new User({
            name: req.body.username,
            color: "#" + Math.floor(Math.random() * 16777215).toString(16),
        })
        await userCreated.save()
        res.send(userCreated)
    }
});

router.get("/sketches", async (req, res) => {
    let sketches = await Sketch.find()
    if (Array.isArray(sketches) && !sketches.length == 0) {
        res.send(sketches[0])
    } else {
        const sketchCreated = new Sketch({
            lines: [],
            users: [],
        })
        await sketchCreated.save()
        res.send(sketchCreated)
    }
});

router.post("/sketches", async (req, res) => {
    let sketches = await Sketch.find()
    if (Array.isArray(sketches) && !sketches.length == 0) {
        let sketch = sketches[0];
        sketch.lines = req.body.lines;
        if (!sketch.users.find(user => user.name == req.body.user.name)) {
            sketch.users.push(req.body.user)
        }
        sketch.save();
        res.send(sketch)
    } else {
        const sketchCreated = new Sketch({
            lines: req.body.lines,
            users: [req.body.user],
        })
        await sketchCreated.save()
        res.send(sketchCreated)
    }
    
});

module.exports = router