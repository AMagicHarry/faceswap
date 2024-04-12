import Replicate from "replicate";
import request from "request";
import fs from "fs";

import dotenv from "dotenv";
dotenv.config();

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});

async function main() {
    const mine = "https://i.postimg.cc/bvN4n1hB/male-5.jpg";

    const input = {
        swap_image: mine, //My Image
        target_image: "https://i.postimg.cc/WpB9xJN6/handsome-bearded-guy-posing-against-white-wall.jpg"
    };

    const output = await replicate.run("omniedgeio/face-swap:c2d783366e8d32e6e82c40682fab6b4c23b9c6eff2692c0cf7585fc16c238cfe", { input });
    console.log(output);

    request(output).pipe(fs.createWriteStream('image.jpg')).on('close', function () {
        console.log('Image downloaded!');
    });
}

main();