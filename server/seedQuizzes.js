import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Quiz from './models/Quiz.js';

dotenv.config();

const quizzes = [
    {
        title: {
            en: "Beginner Bird Watcher",
            hi: "शुरुआती पक्षी दर्शक"
        },
        description: {
            en: "Test your basic knowledge of common birds.",
            hi: "आम पक्षियों के बारे में अपने बुनियादी ज्ञान का परीक्षण करें।"
        },
        difficulty: "Easy",
        isPublished: true,
        questions: [
            {
                questionText: {
                    en: "Which represents the National Bird of India?",
                    hi: "भारत का राष्ट्रीय पक्षी कौन सा है?"
                },
                options: [
                    { en: "Parrot", hi: "तोता" },
                    { en: "Peacock", hi: "मोर" },
                    { en: "Eagle", hi: "चील" },
                    { en: "Crow", hi: "कौवा" }
                ],
                correctAnswer: 1
            },
            {
                questionText: {
                    en: "Which bird is known for its beautiful voice?",
                    hi: "कौन सा पक्षी अपनी सुंदर आवाज के लिए जाना जाता है?"
                },
                options: [
                    { en: "Cuckoo (Koel)", hi: "कोयल" },
                    { en: "Sparrow", hi: "गौरैया" },
                    { en: "Pigeon", hi: "कबूतर" },
                    { en: "Owl", hi: "उल्लू" }
                ],
                correctAnswer: 0
            },
            {
                questionText: {
                    en: "What do most birds use to build nests?",
                    hi: "ज्यादातर पक्षी घोंसले बनाने के लिए किस चीज का उपयोग करते हैं?"
                },
                options: [
                    { en: "Bricks", hi: "ईंटें" },
                    { en: "Twigs and Leaves", hi: "टहनियाँ और पत्ते" },
                    { en: "Plastic", hi: "प्लास्टिक" },
                    { en: "Glass", hi: "कांच" }
                ],
                correctAnswer: 1
            },
            {
                questionText: {
                    en: "Which bird can rotate its head 270 degrees?",
                    hi: "कौन सा पक्षी अपना सिर 270 डिग्री घुमा सकता है?"
                },
                options: [
                    { en: "Owl", hi: "उल्लू" },
                    { en: "Ostrich", hi: "शुतुरमुर्ग" },
                    { en: "Flamingo", hi: " राजहंस" },
                    { en: "Parrot", hi: "तोता" }
                ],
                correctAnswer: 0
            },
            {
                questionText: {
                    en: "Which of these birds cannot fly?",
                    hi: "इनमें से कौन सा पक्षी उड़ नहीं सकता?"
                },
                options: [
                    { en: "Sparrow", hi: "गौरैया" },
                    { en: "Penguin", hi: "पेंगुइन" },
                    { en: "Crow", hi: "कौवा" },
                    { en: "Eagle", hi: "चील" }
                ],
                correctAnswer: 1
            }
        ]
    },
    {
        title: {
            en: "Bird Enthusiast",
            hi: "पक्षी प्रेमी"
        },
        description: {
            en: "For those who know more than just the basics.",
            hi: "उन लोगों के लिए जो सिर्फ बुनियादी बातों से ज्यादा जानते हैं।"
        },
        difficulty: "Medium",
        isPublished: true,
        questions: [
            {
                questionText: {
                    en: "Which is the largest bird sanctuary in Rajasthan?",
                    hi: "राजस्थान का सबसे बड़ा पक्षी अभयारण्य कौन सा है?"
                },
                options: [
                    { en: "Ranthambore", hi: "रणथंभौर" },
                    { en: "Keoladeo Ghana (Bharatpur)", hi: "केवलादेव घना (भरतपुर)" },
                    { en: "Sariska", hi: "सरिस्का" },
                    { en: "Desert National Park", hi: "डेजर्ट नेशनल पार्क" }
                ],
                correctAnswer: 1
            },
            {
                questionText: {
                    en: "What is the primary diet of a Vulture?",
                    hi: "गीध का मुख्य आहार क्या है?"
                },
                options: [
                    { en: "Fresh Fruit", hi: "ताजे फल" },
                    { en: "Carrion (Dead animals)", hi: "सड़ा हुआ मांस (मृत जानवर)" },
                    { en: "Seeds", hi: "बीज" },
                    { en: "Insects", hi: "कीड़े" }
                ],
                correctAnswer: 1
            },
            {
                questionText: {
                    en: "Which bird migrates over the Himalayas?",
                    hi: "कौन सा पक्षी हिमालय के ऊपर से प्रवास करता है?"
                },
                options: [
                    { en: "Bar-headed Goose", hi: "बार-headed हंस" },
                    { en: "Kingfisher", hi: "किंगफिशर" },
                    { en: "Peacock", hi: "मोर" },
                    { en: "Parrot", hi: "तोता" }
                ],
                correctAnswer: 0
            },
            {
                questionText: {
                    en: "What is the state bird of Rajasthan?",
                    hi: "राजस्थान का राज्य पक्षी कौन सा है?"
                },
                options: [
                    { en: "Great Indian Bustard", hi: "ग्रेट इंडियन बस्टर्ड (गोडावण)" },
                    { en: "Peacock", hi: "मोर" },
                    { en: "Flamingo", hi: "राजहंस" },
                    { en: "Sarus Crane", hi: "सारस क्रेन" }
                ],
                correctAnswer: 0
            },
            {
                questionText: {
                    en: "Which bird is famous for its dance in the rain?",
                    hi: "कौन सा पक्षी बारिश में अपने नृत्य के लिए प्रसिद्ध है?"
                },
                options: [
                    { en: "Peacock", hi: "मोर" },
                    { en: "Crow", hi: "कौवा" },
                    { en: "Sparrow", hi: "गौरैया" },
                    { en: "Eagle", hi: "चील" }
                ],
                correctAnswer: 0
            }
        ]
    },
    {
        title: {
            en: "Expert Ornithologist",
            hi: "विशेषज्ञ पक्षी विज्ञानी"
        },
        description: {
            en: "A challenge for true bird masters.",
            hi: "सच्चे पक्षी स्वामी के लिए एक चुनौती।"
        },
        difficulty: "Hard",
        isPublished: true,
        questions: [
            {
                questionText: {
                    en: "What is the scientific name of the Great Indian Bustard?",
                    hi: "ग्रेट इंडियन बस्टर्ड का वैज्ञानिक नाम क्या है?"
                },
                options: [
                    { en: "Pavo cristatus", hi: "पावो क्रिस्टेटस" },
                    { en: "Ardeotis nigriceps", hi: "अर्दियोटिस निग्रिसेप्स" },
                    { en: "Grus antigone", hi: "ग्रस एंटीगोन" },
                    { en: "Gyps indicus", hi: "जिप्स इंडिकस" }
                ],
                correctAnswer: 1
            },
            {
                questionText: {
                    en: "Which pigment gives flamingos their pink color?",
                    hi: "कौन सा वर्णक राजहंस को उनका गुलाबी रंग देता है?"
                },
                options: [
                    { en: "Melanin", hi: "मेलेनिन" },
                    { en: "Carotenoids", hi: "कैरोटीनॉयड" },
                    { en: "Chlorophyll", hi: "क्लोरोफिल" },
                    { en: "Hemoglobin", hi: "हीमोग्लोबिन" }
                ],
                correctAnswer: 1
            },
            {
                questionText: {
                    en: "The 'Siberian Crane' is a critically endangered visitor to which park?",
                    hi: "'साइबेरियन क्रेन' किस पार्क का एक गंभीर रूप से संकटग्रस्त आगंतुक है?"
                },
                options: [
                    { en: "Jim Corbett", hi: "जिम कॉर्बेट" },
                    { en: "Keoladeo National Park", hi: "केवलादेव राष्ट्रीय उद्यान" },
                    { en: "Kaziranga", hi: "काजीरंगा" },
                    { en: "Gir Forest", hi: "गिर वन" }
                ],
                correctAnswer: 1
            },
            {
                questionText: {
                    en: "Which bird has the largest wingspan in the world?",
                    hi: "दुनिया में किस पक्षी का पंख फैलाव सबसे बड़ा है?"
                },
                options: [
                    { en: "Wandering Albatross", hi: "वांडरिंग अल्बाट्रॉस" },
                    { en: "California Condor", hi: "कैलिफोर्निया कोंडोर" },
                    { en: "Golden Eagle", hi: "गोल्डन ईगल" },
                    { en: "Ostrich", hi: "शुतुरमुर्ग" }
                ],
                correctAnswer: 0
            },
            {
                questionText: {
                    en: "What term describes the study of bird eggs?",
                    hi: "पक्षी के अंडों के अध्ययन को क्या कहते हैं?"
                },
                options: [
                    { en: "Ornithology", hi: "ओर्निथोलॉजी" },
                    { en: "Oology", hi: "ओलोजी" },
                    { en: "Nidology", hi: "निडोलॉजी" },
                    { en: "Aviculture", hi: "एविकल्चर" }
                ],
                correctAnswer: 1
            }
        ]
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB.");

        // Clear existing quizzes
        await Quiz.deleteMany({});
        console.log("Cleared existing quizzes.");

        // Insert new quizzes
        await Quiz.insertMany(quizzes);
        console.log("Added 3 new quizzes (Easy, Medium, Hard).");

        mongoose.disconnect();
    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }
};

seedDB();
