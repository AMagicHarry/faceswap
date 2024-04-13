import Replicate from "replicate";
import request from "request";
import fs from "fs";
import sqlite3 from "sqlite3";
import dotenv from "dotenv";

dotenv.config();
const db = new sqlite3.Database("./database.sqlite");
const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});

async function main() {
    const query_target = "SELECT * FROM Target ORDER BY RANDOM() LIMIT 1";

    db.get(query_target, [], (err, row) => {
        if (err) {
            throw err;
        }

        const target = row.target_photo;

        const mine = "https://i.postimg.cc/bvN4n1hB/male-5.jpg";

        const input = {
            swap_image: mine,
            target_image: target,
        };

        replicate.run("omniedgeio/face-swap:c2d783366e8d32e6e82c40682fab6b4c23b9c6eff2692c0cf7585fc16c238cfe", { input })
            .then((output) => {
                request(output).pipe(fs.createWriteStream('image.jpg')).on('close', function () {
                    console.log('Image downloaded!');
                });
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
                db.close();
            });
    });
}

main();