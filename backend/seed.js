const mongoose = require("mongoose");
const User = require("./models/User");
const Post = require("./models/Post");
const Profile = require("./models/Profile");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const samplePosts = [
  {
    title: "Beautiful Sunset View 🌅",
    postImage: "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=500&h=500&fit=crop",
  },
  {
    title: "Morning Coffee ☕ Best Part of the Day",
    postImage: "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=500&h=500&fit=crop",
  },
  {
    title: "Mountain Adventure 🏔️",
    postImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=500&fit=crop",
  },
  {
    title: "Ocean Waves & Good Vibes 🌊",
    postImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&h=500&fit=crop",
  },
  {
    title: "Hiking Trail Views 🥾",
    postImage: "https://images.unsplash.com/photo-1551534164-0412daf446d5?w=500&h=500&fit=crop",
  },
  {
    title: "City Lights at Night 🌃",
    postImage: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=500&h=500&fit=crop",
  },
  {
    title: "Forest Walk & Nature 🌲",
    postImage: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&h=500&fit=crop",
  },
  {
    title: "Golden Hour Photography 📸",
    postImage: "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=500&h=500&fit=crop",
  },
  {
    title: "Beach Day! Sun & Sand ☀️",
    postImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&h=500&fit=crop",
  },
  {
    title: "Starry Night Adventure ⭐",
    postImage: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=500&h=500&fit=crop",
  },
  {
    title: "Summer Vibes 🌞",
    postImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop",
  },
  {
    title: "Autumn Colors 🍂",
    postImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=500&fit=crop",
  },
  {
    title: "Street Photography 🎭",
    postImage: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=500&h=500&fit=crop",
  },
  {
    title: "Winter Wonderland ❄️",
    postImage: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=500&h=500&fit=crop",
  },
  {
    title: "Flower Photography 🌸",
    postImage: "https://images.unsplash.com/photo-1490612967868-a47b0f85b5c9?w=500&h=500&fit=crop",
  },
  {
    title: "Urban Exploration 🏙️",
    postImage: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=500&h=500&fit=crop",
  },
  {
    title: "Sunset at the Lake 🌅",
    postImage: "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=500&h=500&fit=crop",
  },
  {
    title: "Perfect Moment Captured 📷",
    postImage: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&h=500&fit=crop",
  },
  {
    title: "Nature's Beauty 🌿",
    postImage: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&h=500&fit=crop",
  },
  {
    title: "Adventure Awaits 🚀",
    postImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=500&fit=crop",
  },
];

const sampleUsers = [
  {
    userName: "adventureseeker",
    fullName: "Alex Johnson",
    email: "alex@instagram.com",
    password: "password123",
  },
  {
    userName: "naturelover",
    fullName: "Sarah Smith",
    email: "sarah@instagram.com",
    password: "password123",
  },
  {
    userName: "cityexplorer",
    fullName: "Mike Chen",
    email: "mike@instagram.com",
    password: "password123",
  },
  {
    userName: "photoartist",
    fullName: "Emma Williams",
    email: "emma@instagram.com",
    password: "password123",
  },
  {
    userName: "travelbugs",
    fullName: "James Brown",
    email: "james@instagram.com",
    password: "password123",
  },
];

async function seedDatabase() {
  try {
    // Connect to MongoDB (fall back to local docker Mongo if no env provided)
    const mongoUrl =
      process.env.MONGODB_URL || "mongodb://localhost:27017/instadb";

    await mongoose.connect(mongoUrl);
    console.log(`Connected to MongoDB (${mongoUrl})`);

    // Clear existing data (optional)
    // await User.deleteMany({});
    // await Post.deleteMany({});
    // await Profile.deleteMany({});
    // console.log("Cleared existing data");

    // Create users
    const createdUsers = [];
    for (const user of sampleUsers) {
      const existingUser = await User.findOne({ userName: user.userName });
      if (!existingUser) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        const profile = await Profile.create({
          gender: null,
          dateOfBirth: null,
          about: null,
          mobileNumber: null,
        });

        const newUser = await User.create({
          userName: user.userName,
          fullName: user.fullName,
          email: user.email,
          password: hashedPassword,
          additionDetails: profile._id,
          image: `https://api.dicebear.com/7.x/initials/svg?seed=${user.fullName}`,
        });

        profile.user = newUser._id;
        await profile.save();

        createdUsers.push(newUser);
        console.log(`✅ Created user: ${user.userName}`);
      } else {
        createdUsers.push(existingUser);
        console.log(`⏭️  User already exists: ${user.userName}`);
      }
    }

    // Create posts
    let postCount = 0;
    for (const postData of samplePosts) {
      const randomUserIndex = Math.floor(Math.random() * createdUsers.length);
      const user = createdUsers[randomUserIndex];

      // Check if post already exists
      const existingPost = await Post.findOne({
        title: postData.title,
        createdBy: user._id,
      });

      if (!existingPost) {
        const post = await Post.create({
          title: postData.title,
          createdBy: user._id,
          postImage: postData.postImage,
        });

        // Add post to user's posts array
        await User.findByIdAndUpdate(user._id, {
          $push: { posts: post._id },
        });

        postCount++;
        console.log(`✅ Created post: "${postData.title}" by ${user.fullName}`);
      } else {
        console.log(`⏭️  Post already exists: "${postData.title}"`);
      }
    }

    console.log(`\n🎉 Seeding complete!`);
    console.log(`Created ${createdUsers.length} users`);
    console.log(`Created ${postCount} posts`);
    console.log(`Total posts in database: ${await Post.countDocuments()}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
