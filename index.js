import express, { Express, Request, Response } from "express";
import * as fs from "fs";
import * as path from "path";

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const imagesFolder = path.join(__dirname, "public/images");

const validExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];

app.get("/random", (req, res) => {
    fs.readdir(imagesFolder, (err, files) => {
        if (err) {
            res.status(500).send("Erro ao ler a pasta de imagens");
            return;
        }

        const imageFiles = files.filter((file) =>
            validExtensions.includes(path.extname(file).toLowerCase())
        );

        if (imageFiles.length === 0) {
            res.status(404).send("Nenhuma imagem encontrada");
            return;
        }

        const randomIndex = Math.floor(Math.random() * imageFiles.length);
        const randomImage = imageFiles[randomIndex];
        res.sendFile(path.join(imagesFolder, randomImage));
    });
});

app.get("/:imageName", (req, res) => {
    const imageName = req.params.imageName;
    const imagePath = path.join(imagesFolder, imageName);

    if (!validExtensions.includes(path.extname(imageName).toLowerCase())) {
        res.status(400).send("Formato de arquivo não suportado");
        return;
    }

    fs.access(imagePath, fs.constants.F_OK, (err) => {
        if (err) {
            res.status(404).send("A imagem solicitada não existe");
        } else {
            res.sendFile(imagePath);
        }
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
