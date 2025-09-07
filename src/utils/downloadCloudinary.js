// src/utils/downloader.js

import axios from "axios";
import fs from "fs";

const downloadFile = async(url, destinationPath) => {
    try {
        const response = await axios.get(url, { responseType: "stream" });
        const writer = fs.createWriteStream(destinationPath);
        
        response.data.pipe(writer);
        
        return new Promise((resolve, reject) => {
            writer.on("finish", () => {
                console.log(`Successfully downloaded file to ${destinationPath}`);
                resolve();
            });
            writer.on("error", reject); 
        });
    } catch (error) {

        throw error;
    }
};

export default downloadFile;