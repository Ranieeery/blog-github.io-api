import express, { Express, Request, Response } from "express";
import * as fs from "fs";
import * as path from "path";

const app: Express = express();
const port: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const imagesFolder: string = path.join(__dirname, "images");

// Allowed image extensions
const validExtensions: string[] = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

app.get("/random", (req: Request, res: Response): void => {
    fs.readdir(
        imagesFolder,
        (err: NodeJS.ErrnoException | null, files: string[]) => {
            if (err) {
                res.status(500).send("Erro ao ler a pasta de imagens");
                return;
            }

            // Filter only valid image files
            const imageFiles = files.filter(file => 
                validExtensions.includes(path.extname(file).toLowerCase())
            );

            if (imageFiles.length === 0) {
                res.status(404).send("Nenhuma imagem encontrada");
                return;
            }

            const randomIndex: number = Math.floor(Math.random() * imageFiles.length);
            const randomImage: string = imageFiles[randomIndex];
            res.sendFile(path.join(imagesFolder, randomImage));
        }
    );
});

app.get("/:imageName", (req: Request, res: Response): void => {
    const imageName: string = req.params.imageName;
    const imagePath: string = path.join(imagesFolder, imageName);

    // Validate file extension
    if (!validExtensions.includes(path.extname(imageName).toLowerCase())) {
        res.status(400).send("Formato de arquivo não suportado");
        return;
    }

    fs.access(
        imagePath,
        fs.constants.F_OK,
        (err: NodeJS.ErrnoException | null) => {
            if (err) {
                res.status(404).send("A imagem solicitada não existe");
            } else {
                res.sendFile(imagePath);
            }
        }
    );
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});