/**
 * Cleanup Script: Remove Local Images After Cloudinary Migration
 * 
 * This script safely removes local images after confirming they've been 
 * migrated to Cloudinary. It will:
 * 1. Check all products in the database
 * 2. Identify those with Cloudinary URLs
 * 3. If ALL products have been migrated, offer to remove local files
 * 4. If some products still use local paths, provide a warning
 */

require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const Product = require('../models/Product');

// Path to uploads directory
const uploadsDir = path.join(__dirname, '../uploads');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    checkMigrationStatus();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

async function checkMigrationStatus() {
  try {
    // Count total products
    const totalProducts = await Product.countDocuments();
    
    // Count products with local image paths
    const localImageProducts = await Product.countDocuments({
      image: { $regex: '^/uploads/', $options: 'i' }
    });
    
    // Count products with Cloudinary URLs
    const cloudinaryProducts = await Product.countDocuments({
      image: { $regex: '^https://res.cloudinary.com/', $options: 'i' }
    });
    
    console.log('\n========= Migration Status =========');
    console.log(`Total products: ${totalProducts}`);
    console.log(`Products with local images: ${localImageProducts}`);
    console.log(`Products with Cloudinary images: ${cloudinaryProducts}`);
    console.log('===================================\n');
    
    if (localImageProducts === 0 && cloudinaryProducts > 0) {
      console.log('✅ All products appear to have been migrated to Cloudinary!');
      await promptForCleanup();
    } else if (localImageProducts > 0) {
      console.log('⚠️ Migration incomplete: Some products still use local image paths.');
      console.log('Please run the migration script (migrate-to-cloudinary.js) first.');
      await disconnectAndExit();
    } else {
      console.log('ℹ️ No products with local images found.');
      await promptForCleanup();
    }
  } catch (error) {
    console.error('Error checking migration status:', error);
    await disconnectAndExit();
  }
}

async function promptForCleanup() {
  rl.question('Do you want to remove local images? (yes/no): ', async (answer) => {
    if (answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y') {
      await cleanupLocalImages();
    } else {
      console.log('Cleanup cancelled. Local files remain untouched.');
      await disconnectAndExit();
    }
  });
}

async function cleanupLocalImages() {
  try {
    console.log('Starting cleanup of local images...');
    
    // Check if uploads directory exists
    if (!fs.existsSync(uploadsDir)) {
      console.log('Uploads directory does not exist. Nothing to clean up.');
      await disconnectAndExit();
      return;
    }
      // Function to recursively delete directory contents
    const deleteDirectoryContents = (dirPath) => {
      if (fs.existsSync(dirPath)) {
        // Store files that could not be deleted for later retry
        const failedDeletes = [];
        
        fs.readdirSync(dirPath).forEach((file) => {
          const curPath = path.join(dirPath, file);
          try {
            if (fs.lstatSync(curPath).isDirectory()) {
              // Recursive case: it's a directory
              deleteDirectoryContents(curPath);
              try {
                fs.rmdirSync(curPath);
                console.log(`Removed directory: ${curPath}`);
              } catch (dirErr) {
                console.log(`⚠️ Could not remove directory: ${curPath}`);
                console.log(`   Reason: ${dirErr.message}`);
                failedDeletes.push({ path: curPath, isDir: true });
              }
            } else {
              // Base case: it's a file
              try {
                fs.unlinkSync(curPath);
                console.log(`Removed file: ${curPath}`);
              } catch (fileErr) {
                if (fileErr.code === 'EBUSY' || fileErr.code === 'EPERM') {
                  console.log(`⚠️ File is busy/locked: ${curPath}`);
                  failedDeletes.push({ path: curPath, isDir: false });
                } else {
                  console.log(`⚠️ Error deleting file: ${curPath}`);
                  console.log(`   Reason: ${fileErr.message}`);
                  failedDeletes.push({ path: curPath, isDir: false });
                }
              }
            }
          } catch (err) {
            console.log(`⚠️ Error processing path: ${curPath}`);
            console.log(`   Reason: ${err.message}`);
          }
        });
        
        // Return list of failed deletes for potential retry
        return failedDeletes;
      }
      return [];
    };
      // Delete contents of uploads directory
    const failedDeletes = deleteDirectoryContents(uploadsDir);
    
    if (failedDeletes.length > 0) {
      console.log('\n⚠️ Some files or directories could not be deleted:');
      failedDeletes.forEach(item => {
        console.log(`   - ${item.path}`);
      });
      
      console.log('\nTroubleshooting tips:');
      console.log('1. Make sure your server is stopped (no running node processes)');
      console.log('2. Close any Windows Explorer windows that might be viewing these folders');
      console.log('3. Temporarily disable antivirus scanning');
      console.log('4. Try running this script again');
      console.log('\nAlternatively, you can try:');
      console.log('1. Manually deleting the files after restarting your computer');
      console.log('2. Using the Windows command: "del /F /Q path\\to\\file"');
      
      rl.question('\nWould you like to retry deleting these files? (yes/no): ', async (answer) => {
        if (answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y') {
          console.log('\nRetrying failed deletions...');
          
          // Simple retry for each failed deletion
          const stillFailed = [];
          for (const item of failedDeletes) {
            try {
              if (item.isDir) {
                fs.rmdirSync(item.path);
              } else {
                fs.unlinkSync(item.path);
              }
              console.log(`✅ Successfully removed on retry: ${item.path}`);
            } catch (retryErr) {
              console.log(`❌ Still cannot remove: ${item.path}`);
              stillFailed.push(item);
            }
          }
          
          if (stillFailed.length === 0) {
            console.log('\n✅ All items successfully removed on retry!');
          } else {
            console.log(`\n⚠️ ${stillFailed.length} items still could not be removed.`);
            console.log('You may need to restart your computer to release file locks.');
          }
        }
        
        console.log('\n✅ Cleanup process completed!');
        console.log(`Successfully removed ${failedDeletes.length - (stillFailed?.length || 0)} items.`);
        console.log('\nNOTE: The empty uploads directory structure is still maintained');
        console.log('for compatibility with the current middleware.');
        await disconnectAndExit();
      });
    } else {
      console.log('\n✅ Local image cleanup complete!');
      console.log('The uploads directory has been emptied.');
      console.log('\nNOTE: The empty uploads directory structure is still maintained');
      console.log('for compatibility with the current middleware.');
      await disconnectAndExit();
    }
  } catch (error) {
    console.error('Error during cleanup:', error);
    await disconnectAndExit();
  }
}

async function disconnectAndExit() {
  await mongoose.disconnect();
  console.log('Disconnected from MongoDB');
  rl.close();
  process.exit(0);
}
