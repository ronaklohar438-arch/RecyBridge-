require("dotenv").config();

const express = require("express");
const multer = require("multer");
const path = require("path");
const mongoose = require("mongoose");

const Collection = require("./models/Collection");
const Collector = require("./models/Collector");
const User = require("./models/User");
const session = require("express-session");
const bcrypt = require("bcryptjs");

const app = express();


// =========================
// MongoDB Connection
// =========================

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB connected successfully!");
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error);
    });


// =========================
// Image Upload Configuration
// =========================

const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },

    filename: function (req, file, cb) {
        const extension = path.extname(file.originalname);
        const filename = Date.now() + extension;

        cb(null, filename);
    }

});

const upload = multer({
    storage: storage
});


const PORT = 3000;

app.set("view engine", "ejs");

app.use(express.static("public"));

app.use(express.urlencoded({
    extended: true
}));
// =========================
// Session Authentication
// =========================

app.use(session({
    secret: process.env.SESSION_SECRET || "kabadiwala-connect-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000
    }
}));

app.use("/uploads", express.static("uploads"));

// =========================
// Authentication Middleware
// =========================

function requireLogin(req, res, next) {

    if (!req.session.userId) {
        return res.redirect("/login");
    }

    next();
}
// =========================
// Role Authorization Middleware
// =========================

function requireRole(role) {

    return function (req, res, next) {

        if (!req.session.userId) {
            return res.redirect("/login");
        }

        if (req.session.userRole !== role) {
            return res.status(403).send(
                "Access denied. You are not authorized to access this page."
            );
        }

        next();
    };
}

// =========================
// Home
// =========================

app.get("/", (req, res) => {

    res.render("index");

});

// =========================
// LOGIN PAGE
// =========================

app.get("/login", (req, res) => {

    res.render("login");

});


// =========================
// REGISTER PAGE
// =========================

app.get("/register", (req, res) => {

    res.render("register");

});


// =========================
// REGISTER USER
// =========================

app.post("/register", async (req, res) => {

    try {

        const {
            name,
            email,
            password,
            role
        } = req.body;

        // Check existing user
        const existingUser = await User.findOne({
            email: email.toLowerCase()
        });

        if (existingUser) {

            return res.status(400).send(
                "An account with this email already exists. Please login."
            );

        }

        // Hash password
        const hashedPassword =
            await bcrypt.hash(password, 10);

        // Create user
        const user = new User({

            name,

            email: email.toLowerCase(),

            password: hashedPassword,

            role

        });

        await user.save();

        res.redirect("/login");

    } catch (error) {

        console.error(
            "Registration error:",
            error
        );

        res.status(500).send(
            "Something went wrong during registration"
        );

    }

});


// =========================
// LOGIN USER
// =========================

app.post("/login", async (req, res) => {

    try {

        const {
            email,
            password,
            role
        } = req.body;

        // Find user
        const user = await User.findOne({
            email: email.toLowerCase()
        });

        if (!user) {

            return res.status(401).send(
                "Invalid email or password"
            );

        }

        // Check role
        if (user.role !== role) {

            return res.status(401).send(
                "Selected role does not match this account"
            );

        }

        // Check password
        const passwordMatch =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!passwordMatch) {

            return res.status(401).send(
                "Invalid email or password"
            );

        }

// Save user in session
req.session.userId = user._id.toString();
req.session.userName = user.name;
req.session.userRole = user.role;

// Make sure session is saved before redirect
req.session.save((error) => {

    if (error) {

        console.error("Session save error:", error);

        return res.status(500).send(
            "Could not create login session"
        );

    }

    // Redirect according to role
    if (user.role === "collector") {

        return res.redirect("/collector");

    }

    if (user.role === "recycler") {

        return res.redirect("/recycler");

    }

});
    } catch (error) {

        console.error(
            "Login error:",
            error
        );

        res.status(500).send(
            "Something went wrong during login"
        );

    }

});


// =========================
// LOGOUT
// =========================

app.get("/logout", (req, res) => {

    req.session.destroy((error) => {

        if (error) {

            console.error(
                "Logout error:",
                error
            );

            return res.status(500).send(
                "Could not logout"
            );

        }

        res.redirect("/login");

    });

});

// =========================
// Collector Dashboard
// =========================

app.get("/collector", requireRole("collector"), async (req, res) => {

    try {

        const collections =
            await Collection.find()
                .sort({ createdAt: -1 });


        const totalWeight =
            collections.reduce(
                (sum, item) =>
                    sum + (Number(item.weight) || 0),
                0
            );


        const totalEarnings =
            collections.reduce(
                (sum, item) =>
                    sum + (Number(item.value) || 0),
                0
            );


        const totalCollections =
            collections.length;


res.render("collector", {

    collections,

    totalWeight,

    totalEarnings,

    totalCollections,

    userName: req.session.userName

});

    } catch (error) {

        console.error(
            "Error fetching collections:",
            error
        );

        res.status(500).send(
            "Something went wrong"
        );

    }

});


// =========================
// Collector Profile
// =========================

app.get("/profile", requireRole("collector"), async (req, res) => {

    try {

        let collector =
            await Collector.findOne();


        const collections =
            await Collection.find();


        const totalWeight =
            collections.reduce(
                (sum, item) =>
                    sum + (Number(item.weight) || 0),
                0
            );


        const totalEarnings =
            collections.reduce(
                (sum, item) =>
                    sum + (Number(item.value) || 0),
                0
            );


        const totalCollections =
            collections.length;


        res.render("profile", {

            collector,

            totalWeight,

            totalEarnings,

            totalCollections

        });


    } catch (error) {

        console.error(
            "Error loading profile:",
            error
        );

        res.status(500).send(
            "Error loading profile"
        );

    }

});


// =========================
// Save / Update Collector Profile
// =========================

app.post("/profile/update", requireRole("collector"), async (req, res) => {

    try {

        const {
            name,
            phone,
            area
        } = req.body;


        let collector =
            await Collector.findOne();


        if (collector) {

            collector.name = name;
            collector.phone = phone;
            collector.area = area;

            await collector.save();

        } else {

            const newCollector =
                new Collector({

                    name: name,

                    phone: phone,

                    area: area

                });


            await newCollector.save();

        }


        res.redirect("/profile");


    } catch (error) {

        console.error(
            "Error updating profile:",
            error
        );

        res.status(500).send(
            "Error updating profile"
        );

    }

});


// =========================
// Recycler Dashboard
// =========================

app.get("/recycler", requireRole("recycler"), async (req, res) => {

    try {

        const collections =
            await Collection.find()
                .sort({ createdAt: -1 });


        // =========================
        // COLLECTORS
        // =========================

        const collectors =
            await Collector.find()
                .sort({ name: 1 });


        // =========================
        // STATUS COUNTS
        // =========================

        const pendingCount =
            collections.filter(
                item =>
                    item.status === "Pending"
            ).length;


        const acceptedCount =
            collections.filter(
                item =>
                    item.status === "Accepted"
            ).length;


        const pickedUpCount =
            collections.filter(
                item =>
                    item.status === "Picked Up"
            ).length;


        const completedCount =
            collections.filter(
                item =>
                    item.status === "Completed"
            ).length;


        const rejectedCount =
            collections.filter(
                item =>
                    item.status === "Rejected"
            ).length;


        // =========================
        // ANALYTICS
        // =========================

        const totalCollections =
            collections.length;


        const totalWeight =
            collections.reduce(
                (sum, item) =>
                    sum + (Number(item.weight) || 0),
                0
            );


        const totalValue =
            collections.reduce(
                (sum, item) =>
                    sum + (Number(item.value) || 0),
                0
            );


        // =========================
        // MATERIAL ANALYTICS
        // =========================

        const materialCounts = {};


        collections.forEach(item => {

            const material =
                item.material || "Unknown";


            if (!materialCounts[material]) {

                materialCounts[material] = 0;

            }


            materialCounts[material]++;

        });


        // =========================
        // RENDER RECYCLER
        // =========================

        res.render("recycler", {
    collections,
    collectors,
    pendingCount,
    acceptedCount,
    pickedUpCount,
    completedCount,
    rejectedCount,
    totalCollections,
    totalWeight,
    totalValue,
    materialCounts,
    userName: req.session.userName
});


    } catch (error) {

        console.error(
            "Error loading recycler dashboard:",
            error
        );

        res.status(500).send(
            "Error loading recycler dashboard"
        );

    }

});


// =========================
// ASSIGN COLLECTOR
// =========================
// Pending Collection
//       ↓
// Collector Assigned
// =========================

app.post("/recycler/assign/:id", requireRole("recycler"), async (req, res) => {

    try {

        const {
            collectorId
        } = req.body;


        // =========================
        // Validate Collector ID
        // =========================

        if (!collectorId) {

            return res.status(400).send(
                "Please select a collector"
            );

        }


        // =========================
        // Find Collection
        // =========================

        const collection =
            await Collection.findById(
                req.params.id
            );


        if (!collection) {

            return res.status(404).send(
                "Collection not found"
            );

        }


        // =========================
        // Only Pending Collection
        // Can Be Assigned
        // =========================

        if (collection.status !== "Pending") {

            return res.status(400).send(
                "Collector can only be assigned to pending collections"
            );

        }


        // =========================
        // Find Collector
        // =========================

        const collector =
            await Collector.findById(
                collectorId
            );


        if (!collector) {

            return res.status(404).send(
                "Collector not found"
            );

        }


        // =========================
        // Save Collector Snapshot
        // =========================

        collection.collector = {

            collectorId:
                collector._id,

            name:
                collector.name,

            phone:
                collector.phone,

            area:
                collector.area

        };


        await collection.save();


        // =========================
        // Back To Recycler
        // =========================

        res.redirect("/recycler");


    } catch (error) {

        console.error(
            "Error assigning collector:",
            error
        );

        res.status(500).send(
            "Something went wrong while assigning collector"
        );

    }

});


// =========================
// ACCEPT COLLECTION
// Pending → Accepted
// =========================

app.post("/recycler/accept/:id", requireRole("recycler"), async (req, res) => {

    try {

        const collection =
            await Collection.findById(
                req.params.id
            );


        if (!collection) {

            return res.status(404).send(
                "Collection not found"
            );

        }


        // =========================
        // Only Pending
        // =========================

        if (collection.status !== "Pending") {

            return res.status(400).send(
                "This collection cannot be accepted"
            );

        }


        // =========================
        // Collector Required
        // =========================

        if (
            !collection.collector ||
            !collection.collector.collectorId
        ) {

            return res.status(400).send(
                "Please assign a collector before accepting this collection"
            );

        }


        // =========================
        // Update Status
        // =========================

        collection.status = "Accepted";


        collection.statusHistory.push({

            status: "Accepted",

            timestamp: new Date()

        });


        await collection.save();


        res.redirect("/recycler");


    } catch (error) {

        console.error(
            "Error accepting collection:",
            error
        );

        res.status(500).send(
            "Something went wrong"
        );

    }

});


// =========================
// PICKUP COLLECTION
// Accepted → Picked Up
// =========================

app.post("/recycler/pickup/:id", requireRole("recycler"), async (req, res) => {

    try {

        const collection =
            await Collection.findById(
                req.params.id
            );


        if (!collection) {

            return res.status(404).send(
                "Collection not found"
            );

        }


        // =========================
        // Must Be Accepted
        // =========================

        if (collection.status !== "Accepted") {

            return res.status(400).send(
                "Collection must be accepted first"
            );

        }


        // =========================
        // Update Status
        // =========================

        collection.status = "Picked Up";


        collection.statusHistory.push({

            status: "Picked Up",

            timestamp: new Date()

        });


        await collection.save();


        res.redirect("/recycler");


    } catch (error) {

        console.error(
            "Error marking pickup:",
            error
        );

        res.status(500).send(
            "Something went wrong"
        );

    }

});


// =========================
// COMPLETE COLLECTION
// Picked Up → Completed
// =========================

app.post("/recycler/complete/:id", requireRole("recycler"), async (req, res) => {

    try {

        const collection =
            await Collection.findById(
                req.params.id
            );


        if (!collection) {

            return res.status(404).send(
                "Collection not found"
            );

        }


        // =========================
        // Must Be Picked Up
        // =========================

        if (collection.status !== "Picked Up") {

            return res.status(400).send(
                "Collection must be picked up first"
            );

        }


        // =========================
        // Update Status
        // =========================

        collection.status = "Completed";


        collection.statusHistory.push({

            status: "Completed",

            timestamp: new Date()

        });


        await collection.save();


        res.redirect("/recycler");


    } catch (error) {

        console.error(
            "Error completing collection:",
            error
        );

        res.status(500).send(
            "Something went wrong"
        );

    }

});


// =========================
// REJECT COLLECTION
// Pending → Rejected
// =========================

app.post("/recycler/reject/:id", requireRole("recycler"), async (req, res) => {

    try {

        const collection =
            await Collection.findById(
                req.params.id
            );


        if (!collection) {

            return res.status(404).send(
                "Collection not found"
            );

        }


        // =========================
        // Only Pending
        // =========================

        if (collection.status !== "Pending") {

            return res.status(400).send(
                "Only pending collections can be rejected"
            );

        }


        // =========================
        // Update Status
        // =========================

        collection.status = "Rejected";


        collection.statusHistory.push({

            status: "Rejected",

            timestamp: new Date()

        });


        await collection.save();


        res.redirect("/recycler");


    } catch (error) {

        console.error(
            "Error rejecting collection:",
            error
        );

        res.status(500).send(
            "Something went wrong"
        );

    }

});


// =========================
// ADD COLLECTION
// =========================

app.post(
    "/collector/add",
    requireRole("collector"),
    upload.single("photo"),
    async (req, res) => {

        try {

            const {
                material,
                weight,
                pickupLocation,
                contactNumber,
                pickupDate
            } = req.body;


            const weightNumber =
                Number(weight);


            // =========================
            // E-Waste Rates
            // =========================

            const rates = {

                mobile: 500,

                laptop: 600,

                computer: 400,

                monitor: 350,

                battery: 250

            };


            // =========================
            // Material Names
            // =========================

            const materialNames = {

                mobile: "Mobile Phones",

                laptop: "Laptops",

                computer: "Computer Parts",

                monitor: "Monitors",

                battery: "Batteries"

            };


            // =========================
            // Calculate Value
            // =========================

            const value =
                weightNumber *
                (rates[material] || 0);


            // =========================
            // Create Collection
            // =========================

            const newCollection =
                new Collection({

                    material:
                        materialNames[material],

                    weight:
                        weightNumber,

                    value:
                        value,

                    pickupLocation:
                        pickupLocation,

                    contactNumber:
                        contactNumber,

                    pickupDate:
                        pickupDate,

                    status:
                        "Pending",


                    // =========================
                    // Initial Status History
                    // =========================

                    statusHistory: [

                        {

                            status:
                                "Pending",

                            timestamp:
                                new Date()

                        }

                    ],


                    // =========================
                    // Photo
                    // =========================

                    photo:
                        req.file
                            ? req.file.filename
                            : null

                });


            await newCollection.save();


            res.redirect("/collector");


        } catch (error) {

            console.error(
                "Error saving collection:",
                error
            );

            res.status(500).send(
                "Something went wrong"
            );

        }

    }
);


// =========================
// Start Server
// =========================

app.listen(PORT, () => {

    console.log(
        `Server running at http://localhost:${PORT}`
    );

});