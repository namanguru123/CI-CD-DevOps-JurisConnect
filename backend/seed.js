const mongoose = require("mongoose");
const User = require("./models/User");
const Post = require("./models/Post");
const Profile = require("./models/Profile");
const bcrypt = require("bcryptjs");
require("dotenv").config();

await Post.deleteMany({});

const samplePosts = [
  {
    title: "Landmark Ruling: New Precedent in Contract Law",
    postImage: "https://picsum.photos/600?random=1",
  },
  {
    title: "How to Structure a Legal Memo for Maximum Impact",
    postImage: "https://picsum.photos/600?random=2",
  },
  {
    title: "Drafting Tips: Effective Witness Statements",
    postImage: "https://picsum.photos/600?random=3",
  },
  {
    title: "Courtroom Strategy: Preparing for Cross-Examination",
    postImage: "https://picsum.photos/600?random=4",
  },
  {
    title: "Understanding the Latest Compliance Regulations",
    postImage: "https://picsum.photos/600?random=5",
  },
  {
    title: "Client Communication: Setting Expectations Upfront",
    postImage: "https://picsum.photos/600?random=6",
  },
  {
    title: "Building a Strong Case File: Document Checklist",
    postImage: "https://picsum.photos/600?random=7",
  },
  {
    title: "Ethics Spotlight: Navigating Conflict of Interest",
    postImage: "https://picsum.photos/600?random=8",
  },
  {
    title: "Top 5 Negotiation Techniques for Legal Settlements",
    postImage: "https://picsum.photos/600?random=9",
  },
  {
    title: "Law Tech Roundup: Tools for Research and Case Management",
    postImage: "https://picsum.photos/600?random=10",
  },
  {
    title: "Best Practices for Courtroom Presentation Slides",
    postImage: "https://picsum.photos/600?random=11",
  },
  {
    title: "Legal Writing: Clarity over Complexity",
    postImage: "https://picsum.photos/600?random=12",
  },
  {
    title: "Continuing Education: Upcoming CLE Topics",
    postImage: "https://picsum.photos/600?random=13",
  },
  {
    title: "Pro Bono Spotlight: Supporting Access to Justice",
    postImage: "https://picsum.photos/600?random=14",
  },
  {
    title: "Managing Stress During Trial Season",
    postImage: "https://picsum.photos/600?random=15",
  },
  {
    title: "A Practical Checklist for Due Diligence",
    postImage: "https://picsum.photos/600?random=16",
  },
  {
    title: "Courtroom Tech: Using Evidence Presentation Software",
    postImage: "https://picsum.photos/600?random=17",
  },
  {
    title: "Effective Brief Writing Under Deadlines",
    postImage: "https://picsum.photos/600?random=18",
  },
  {
    title: "Recent Legislative Updates: What You Need to Know",
    postImage: "https://picsum.photos/600?random=19",
  },
  {
    title: "Creating a Professional Portfolio as a Junior Lawyer",
    postImage: "https://picsum.photos/600?random=20",
  },
];

const sampleUsers = [
  {
    userName: "judge_myers",
    fullName: "Avery Myers",
    email: "avery.myers@jurisconnect.local",
    password: "Justice2026",
  },
  {
    userName: "counsel_rodriguez",
    fullName: "Elena Rodriguez",
    email: "elena.rodriguez@jurisconnect.local",
    password: "Courtroom#1",
  },
  {
    userName: "docket_master",
    fullName: "Samuel Ellis",
    email: "samuel.ellis@jurisconnect.local",
    password: "Briefing2026",
  },
  {
    userName: "litigator_lee",
    fullName: "Jordan Lee",
    email: "jordan.lee@jurisconnect.local",
    password: "Motion2026",
  },
  {
    userName: "clerk_park",
    fullName: "Maya Park",
    email: "maya.park@jurisconnect.local",
    password: "Evidence!23",
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
