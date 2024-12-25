const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const port = process.env.PORT || 3000;

app.use("/images", express.static(path.join(__dirname, "images")));

app.get("/api/images", (req, res) => {
    fs.readdir(path.join(__dirname, "images"), (err, files) => {
        if (err) {
            return res.status(500).json({ error: "Failed to read directory" });
        }
        const images = files.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return [".jpg", ".jpeg", ".png", ".gif"].includes(ext);
        });
        res.json({ images });
    });
});

app.get("/api/images/:imageName", (req, res) => {
    const imageName = req.params.imageName;
    const imagePath = path.join(__dirname, "images", imageName);
    
    if (fs.existsSync(imagePath)) {
        res.sendFile(imagePath);
    } else {
        res.status(404).json({ error: "Image not found" });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
