/**
 * Data Migration Script for Bilingual Schema
 * 
 * This script migrates existing monolingual data to the new bilingual format.
 * Run this script ONCE after deploying the new schema changes.
 * 
 * Usage: node migrate-to-bilingual.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Schedule from './models/Schedule.js';
import FestivalInfo from './models/FestivalInfo.js';
import GalleryImage from './models/GalleryImage.js';
import ResourcePerson from './models/ResourcePerson.js';
import Ebook from './models/Ebook.js';
import Quiz from './models/Quiz.js';

dotenv.config();

// Helper function to convert string to bilingual object
const toBilingual = (value, hindiValue = null) => {
    if (!value) return { en: '', hi: '' };
    if (typeof value === 'object' && value.en && value.hi) {
        return value; // Already bilingual
    }
    return {
        en: value,
        hi: hindiValue || value // Use provided Hindi or duplicate English as placeholder
    };
};

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB connected successfully');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};

// Migrate Schedule collection
const migrateSchedules = async () => {
    console.log('\n📅 Migrating Schedules...');
    try {
        const schedules = await Schedule.find({}).lean();
        let migrated = 0;
        let skipped = 0;

        for (const schedule of schedules) {
            // Check if already migrated
            if (typeof schedule.title === 'object' && schedule.title.en) {
                skipped++;
                continue;
            }

            const updateData = {
                title: toBilingual(schedule.title),
                events: schedule.events?.map(event => ({
                    time: event.time,
                    activity: toBilingual(event.activity),
                    location: toBilingual(event.location),
                    description: toBilingual(event.description),
                })) || []
            };

            await Schedule.findByIdAndUpdate(schedule._id, updateData, {
                runValidators: false // Disable validators during migration
            });
            migrated++;
        }

        console.log(`✅ Schedules: ${migrated} migrated, ${skipped} skipped`);
    } catch (error) {
        console.error('❌ Error migrating schedules:', error);
    }
};

// Migrate FestivalInfo collection
const migrateFestivalInfo = async () => {
    console.log('\n🎪 Migrating Festival Info...');
    try {
        const festivalInfos = await FestivalInfo.find({}).lean();
        let migrated = 0;
        let skipped = 0;

        for (const info of festivalInfos) {
            // Check if already migrated
            if (typeof info.title === 'object' && info.title.en) {
                skipped++;
                continue;
            }

            const updateData = {
                title: toBilingual(info.title),
                description: toBilingual(info.description),
                location: toBilingual(info.location),
                mission: toBilingual(info.mission),
                vision: toBilingual(info.vision),
                about: toBilingual(info.about),
                features: info.features?.map(feature => ({
                    title: toBilingual(feature.title),
                    description: toBilingual(feature.description),
                    icon: feature.icon
                })) || []
            };

            await FestivalInfo.findByIdAndUpdate(info._id, updateData, {
                runValidators: false
            });
            migrated++;
        }

        console.log(`✅ Festival Info: ${migrated} migrated, ${skipped} skipped`);
    } catch (error) {
        console.error('❌ Error migrating festival info:', error);
    }
};

// Migrate GalleryImage collection
const migrateGalleryImages = async () => {
    console.log('\n🖼️  Migrating Gallery Images...');
    try {
        const images = await GalleryImage.find({}).lean();
        let migrated = 0;
        let skipped = 0;

        for (const image of images) {
            // Check if already migrated
            if (typeof image.title === 'object' && image.title.en) {
                skipped++;
                continue;
            }

            const updateData = {
                title: toBilingual(image.title, 'त्योहार फोटो'),
                category: toBilingual(image.category, 'सामान्य')
            };

            await GalleryImage.findByIdAndUpdate(image._id, updateData, {
                runValidators: false
            });
            migrated++;
        }

        console.log(`✅ Gallery Images: ${migrated} migrated, ${skipped} skipped`);
    } catch (error) {
        console.error('❌ Error migrating gallery images:', error);
    }
};

// Migrate ResourcePerson collection
const migrateResourcePersons = async () => {
    console.log('\n👥 Migrating Resource Persons...');
    try {
        const persons = await ResourcePerson.find({}).lean();
        let migrated = 0;
        let skipped = 0;

        for (const person of persons) {
            // Check if already migrated
            if (typeof person.designation === 'object' && person.designation.en) {
                skipped++;
                continue;
            }

            const updateData = {
                designation: toBilingual(person.designation),
                organization: toBilingual(person.organization),
                expertise: toBilingual(person.expertise),
                bio: toBilingual(person.bio),
                topics: toBilingual(person.topics)
            };

            await ResourcePerson.findByIdAndUpdate(person._id, updateData, {
                runValidators: false
            });
            migrated++;
        }

        console.log(`✅ Resource Persons: ${migrated} migrated, ${skipped} skipped`);
    } catch (error) {
        console.error('❌ Error migrating resource persons:', error);
    }
};

// Migrate Ebook collection
const migrateEbooks = async () => {
    console.log('\n📚 Migrating E-books...');
    try {
        const ebooks = await Ebook.find({}).lean();
        let migrated = 0;
        let skipped = 0;

        for (const ebook of ebooks) {
            // Check if already migrated
            if (typeof ebook.title === 'object' && ebook.title.en) {
                skipped++;
                continue;
            }

            const updateData = {
                title: toBilingual(ebook.title),
                description: toBilingual(ebook.description),
                author: toBilingual(ebook.author, 'राजस्थान बर्डिंग फेस्टिवल')
            };

            await Ebook.findByIdAndUpdate(ebook._id, updateData, {
                runValidators: false
            });
            migrated++;
        }

        console.log(`✅ E-books: ${migrated} migrated, ${skipped} skipped`);
    } catch (error) {
        console.error('❌ Error migrating ebooks:', error);
    }
};

// Migrate Quiz collection
const migrateQuizzes = async () => {
    console.log('\n❓ Migrating Quizzes...');
    try {
        const quizzes = await Quiz.find({}).lean();
        let migrated = 0;
        let skipped = 0;

        for (const quiz of quizzes) {
            // Check if already migrated
            if (typeof quiz.title === 'object' && quiz.title.en) {
                skipped++;
                continue;
            }

            const updateData = {
                title: toBilingual(quiz.title),
                description: toBilingual(quiz.description),
                questions: quiz.questions?.map((question, qIndex) => {
                    // Find the correct answer index
                    let correctAnswerIndex = 0;
                    if (typeof question.correctAnswer === 'string') {
                        correctAnswerIndex = question.options.indexOf(question.correctAnswer);
                        if (correctAnswerIndex === -1) correctAnswerIndex = 0;
                    }

                    return {
                        questionText: toBilingual(question.questionText),
                        options: question.options?.map(option => toBilingual(option)) || [],
                        correctAnswer: correctAnswerIndex // Now using index instead of string
                    };
                }) || []
            };

            await Quiz.findByIdAndUpdate(quiz._id, updateData, {
                runValidators: false
            });
            migrated++;
        }

        console.log(`✅ Quizzes: ${migrated} migrated, ${skipped} skipped`);
    } catch (error) {
        console.error('❌ Error migrating quizzes:', error);
    }
};

// Main migration function
const runMigration = async () => {
    console.log('🚀 Starting Data Migration to Bilingual Schema...\n');
    console.log('⚠️  IMPORTANT: This script will modify your database.');
    console.log('⚠️  Make sure you have a backup before proceeding!\n');

    await connectDB();

    try {
        await migrateSchedules();
        await migrateFestivalInfo();
        await migrateGalleryImages();
        await migrateResourcePersons();
        await migrateEbooks();
        await migrateQuizzes();

        console.log('\n✅ Migration completed successfully!');
        console.log('\n📝 Next Steps:');
        console.log('1. Review the migrated data in your database');
        console.log('2. Add proper Hindi translations (currently using placeholders)');
        console.log('3. Update your admin panel to support bilingual input');
        console.log('4. Test the application in both languages');
    } catch (error) {
        console.error('\n❌ Migration failed:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\n🔌 Database connection closed');
    }
};

// Run migration
runMigration();
