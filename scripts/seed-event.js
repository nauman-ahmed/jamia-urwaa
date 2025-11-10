'use strict';

/**
 * Seed script to create sample Event data
 * Run with: node scripts/run-seed-event.js
 * Or via Strapi CLI: strapi scripts:seed-event
 */

module.exports = async ({ strapi }) => {
  try {
    console.log('🌱 Starting event seed...');

    const events = getEventData();

    let createdCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;

    for (const eventData of events) {
      try {
        // Extract Urdu data if present
        const { urduTitle, urduDescription, urduLocation, ...baseEventData } = eventData;
        
        // Check if event already exists by slug in English locale
        const existingEvent = await strapi.db.query('api::event.event').findOne({
          where: { 
            slug: eventData.slug,
            locale: 'en',
          },
        });

        if (existingEvent) {
          console.log(`⚠️  Event "${eventData.title}" already exists. Updating...`);
          
          // Update English version
          await strapi.entityService.update('api::event.event', existingEvent.id, {
            data: {
              title: baseEventData.title,
              description: baseEventData.description,
              location: baseEventData.location,
              startAt: baseEventData.startAt,
              endAt: baseEventData.endAt,
              allDay: baseEventData.allDay,
              publishedAt: new Date(),
            },
            locale: 'en',
          });

          // Try to update or create Urdu translation
          if (urduTitle || urduDescription || urduLocation) {
            try {
              // Check if Urdu locale exists
              const urduLocale = await strapi.db.query('plugin::i18n.locale').findOne({
                where: { code: 'ur' },
              });

              if (!urduLocale) {
                console.log(`   ⚠️  Urdu locale not configured in Strapi`);
              } else {
                const documentService = strapi.plugin('i18n').service('document-service');
                
                // Check if Urdu event exists
                const existingUrduEvent = await strapi.db.query('api::event.event').findOne({
                  where: { 
                    slug: eventData.slug,
                    locale: 'ur',
                  },
                });

                // Ensure proper localization linking using document service
                if (!existingUrduEvent) {
                  // Create new localization using document service
                  try {
                    await documentService.createLocalization({
                      id: existingEvent.id,
                      locale: 'ur',
                      contentType: 'api::event.event',
                    });
                  } catch (createError) {
                    // If it already exists or fails, continue to update
                    console.log(`   Note: ${createError.message}`);
                  }
                }

                // Wait a bit for localization to be created if it was just created
                if (!existingUrduEvent) {
                  await new Promise(resolve => setTimeout(resolve, 100));
                }

                // Update the Urdu localization with translated content
                const urduEvent = await strapi.db.query('api::event.event').findOne({
                  where: { 
                    slug: eventData.slug,
                    locale: 'ur',
                  },
                });

                if (urduEvent) {
                  await strapi.entityService.update('api::event.event', urduEvent.id, {
                    data: {
                      title: urduTitle || baseEventData.title,
                      description: urduDescription || baseEventData.description,
                      location: urduLocation || baseEventData.location,
                      startAt: baseEventData.startAt,
                      endAt: baseEventData.endAt,
                      allDay: baseEventData.allDay,
                      publishedAt: new Date(),
                    },
                    locale: 'ur',
                  });
                  console.log(`   ✅ Updated event with English and Urdu localizations`);
                } else {
                  console.log(`   ⚠️  Could not find Urdu localization to update`);
                }
              }
            } catch (urduError) {
              console.log(`   ⚠️  Urdu translation failed: ${urduError.message}`);
            }
          }

          updatedCount++;
        } else {
          // Check if Urdu locale exists
          const urduLocale = await strapi.db.query('plugin::i18n.locale').findOne({
            where: { code: 'ur' },
          });

          const documentService = strapi.plugin('i18n').service('document-service');
          
          // Step 1: Create the English event
          const event = await strapi.entityService.create('api::event.event', {
            data: {
              title: baseEventData.title,
              description: baseEventData.description,
              location: baseEventData.location,
              startAt: baseEventData.startAt,
              endAt: baseEventData.endAt,
              allDay: baseEventData.allDay,
              slug: baseEventData.slug,
              publishedAt: new Date(),
            },
            locale: 'en',
          });

          // Step 2: Create Urdu localization if locale exists and Urdu data is provided
          if ((urduTitle || urduDescription || urduLocation) && urduLocale) {
            try {
              // Create localization - this creates a copy linked to the English version
              await documentService.createLocalization({
                id: event.id,
                locale: 'ur',
                contentType: 'api::event.event',
              });

              // Step 3: Find and update the Urdu localization with translated content
              // Wait a bit for the localization to be created
              await new Promise(resolve => setTimeout(resolve, 100));
              
              const urduEvent = await strapi.db.query('api::event.event').findOne({
                where: { 
                  slug: baseEventData.slug,
                  locale: 'ur',
                },
              });

              if (urduEvent) {
                await strapi.entityService.update('api::event.event', urduEvent.id, {
                  data: {
                    title: urduTitle || baseEventData.title,
                    description: urduDescription || baseEventData.description,
                    location: urduLocation || baseEventData.location,
                    publishedAt: new Date(),
                  },
                  locale: 'ur',
                });
                console.log(`   ✅ Created event with English and Urdu localizations`);
              } else {
                console.log(`   ⚠️  Urdu localization created but not found for update`);
              }
            } catch (urduError) {
              console.log(`   ⚠️  Urdu translation failed: ${urduError.message}`);
            }
          } else if (urduTitle || urduDescription || urduLocation) {
            console.log(`   ⚠️  Urdu locale not configured in Strapi`);
          }

          console.log(`✅ Created event: "${eventData.title}"`);
          createdCount++;
        }
      } catch (error) {
        console.error(`❌ Error processing event "${eventData.title}":`, error.message);
        skippedCount++;
      }
    }

    console.log('\n📊 Seed Summary:');
    console.log(`   ✅ Created: ${createdCount} events`);
    console.log(`   🔄 Updated: ${updatedCount} events`);
    console.log(`   ⚠️  Skipped: ${skippedCount} events`);
    console.log(`\n✅ Event seed completed successfully!`);
    
  } catch (error) {
    console.error('❌ Error seeding events:', error);
    throw error;
  }
};

/**
 * Get sample event data for Jamia Urwaa
 */
function getEventData() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  // Helper to create dates
  const createDate = (year, month, day, hour = 9, minute = 0) => {
    return new Date(year, month, day, hour, minute);
  };

  return [
    {
      title: 'New Academic Year Opening Ceremony',
      slug: 'new-academic-year-opening-ceremony',
      description: '<p>Join us for the official opening ceremony of the new academic year. This event will include welcome speeches, student orientation, and an overview of the year\'s programs and activities.</p>',
      startAt: createDate(currentYear, currentMonth + 1, 1, 9, 0),
      endAt: createDate(currentYear, currentMonth + 1, 1, 12, 0),
      allDay: false,
      location: 'Main Hall, Jamia Urwaa',
      urduTitle: 'نئے تعلیمی سال کا افتتاحی تقریب',
      urduDescription: '<p>نئے تعلیمی سال کی سرکاری افتتاحی تقریب میں شامل ہوں۔ اس تقریب میں خیرمقدمی خطابات، طلباء کی رہنمائی، اور سال کے پروگراموں اور سرگرمیوں کا جائزہ شامل ہوگا۔</p>',
      urduLocation: 'مین ہال، جامعہ عروہ',
    },
    {
      title: 'Quran Memorization Competition',
      slug: 'quran-memorization-competition',
      description: '<p>Annual Quran memorization competition for students. Categories include Hifz completion, partial memorization, and recitation with Tajweed. Prizes and certificates will be awarded to winners.</p>',
      startAt: createDate(currentYear, currentMonth + 2, 15, 10, 0),
      endAt: createDate(currentYear, currentMonth + 2, 15, 16, 0),
      allDay: false,
      location: 'Prayer Hall, Jamia Urwaa',
      urduTitle: 'قرآن حفظ مقابلہ',
      urduDescription: '<p>طلباء کے لیے سالانہ قرآن حفظ مقابلہ۔ زمرے میں حفظ مکمل، جزوی حفظ، اور تجوید کے ساتھ تلاوت شامل ہیں۔ فاتحین کو انعامات اور سرٹیفکیٹ دیے جائیں گے۔</p>',
      urduLocation: 'نماز ہال، جامعہ عروہ',
    },
    {
      title: 'Islamic Studies Seminar',
      slug: 'islamic-studies-seminar',
      description: '<p>Special seminar on contemporary Islamic issues featuring renowned scholars. Topics include Islamic jurisprudence, Hadith studies, and modern applications of Islamic principles.</p>',
      startAt: createDate(currentYear, currentMonth + 3, 10, 14, 0),
      endAt: createDate(currentYear, currentMonth + 3, 10, 18, 0),
      allDay: false,
      location: 'Conference Hall, Jamia Urwaa',
      urduTitle: 'اسلامیات سیمینار',
      urduDescription: '<p>معاصر اسلامی مسائل پر خصوصی سیمینار جس میں معروف علماء شامل ہوں گے۔ موضوعات میں اسلامی فقہ، حدیث کے مطالعے، اور اسلامی اصولوں کے جدید اطلاقات شامل ہیں۔</p>',
      urduLocation: 'کانفرنس ہال، جامعہ عروہ',
    },
    {
      title: 'Eid-ul-Fitr Celebration',
      slug: 'eid-ul-fitr-celebration',
      description: '<p>Community celebration of Eid-ul-Fitr with special prayers, festive activities, and communal meal. All students, staff, and community members are welcome.</p>',
      startAt: createDate(currentYear, currentMonth + 4, 1, 7, 0),
      endAt: createDate(currentYear, currentMonth + 4, 1, 14, 0),
      allDay: false,
      location: 'Main Campus, Jamia Urwaa',
      urduTitle: 'عید الفطر کی تقریب',
      urduDescription: '<p>عید الفطر کی کمیونٹی تقریب جس میں خصوصی نمازیں، تہوار کی سرگرمیاں، اور اجتماعی کھانا شامل ہے۔ تمام طلباء، عملہ، اور کمیونٹی کے اراکین خوش آمدید ہیں۔</p>',
      urduLocation: 'مین کیمپس، جامعہ عروہ',
    },
    {
      title: 'Annual Graduation Ceremony',
      slug: 'annual-graduation-ceremony',
      description: '<p>Celebrate the achievements of graduating students. The ceremony includes certificate distribution, awards for academic excellence, and speeches by distinguished guests.</p>',
      startAt: createDate(currentYear, currentMonth + 6, 20, 10, 0),
      endAt: createDate(currentYear, currentMonth + 6, 20, 15, 0),
      allDay: false,
      location: 'Main Hall, Jamia Urwaa',
      urduTitle: 'سالانہ فارغ التحصیل تقریب',
      urduDescription: '<p>فارغ التحصیل طلباء کی کامیابیوں کا جشن منائیں۔ تقریب میں سرٹیفکیٹ کی تقسیم، تعلیمی امتیاز کے لیے انعامات، اور معزز مہمانوں کے خطابات شامل ہیں۔</p>',
      urduLocation: 'مین ہال، جامعہ عروہ',
    },
    {
      title: 'Arabic Language Workshop',
      slug: 'arabic-language-workshop',
      description: '<p>Intensive workshop for improving Arabic language skills. Focus on grammar, vocabulary, conversation, and classical Arabic texts. Open to all students.</p>',
      startAt: createDate(currentYear, currentMonth + 1, 5, 9, 0),
      endAt: createDate(currentYear, currentMonth + 1, 5, 13, 0),
      allDay: false,
      location: 'Classroom Block A, Jamia Urwaa',
      urduTitle: 'عربی زبان کا ورکشاپ',
      urduDescription: '<p>عربی زبان کی مہارتوں کو بہتر بنانے کے لیے انتہائی ورکشاپ۔ گرامر، الفاظ، گفتگو، اور کلاسیکی عربی متون پر توجہ مرکوز۔ تمام طلباء کے لیے کھلا۔</p>',
      urduLocation: 'کلاس روم بلاک اے، جامعہ عروہ',
    },
    {
      title: 'Parent-Teacher Meeting',
      slug: 'parent-teacher-meeting',
      description: '<p>Quarterly parent-teacher meeting to discuss student progress, academic performance, and address any concerns. All parents are encouraged to attend.</p>',
      startAt: createDate(currentYear, currentMonth + 2, 25, 14, 0),
      endAt: createDate(currentYear, currentMonth + 2, 25, 17, 0),
      allDay: false,
      location: 'Administration Building, Jamia Urwaa',
      urduTitle: 'والدین-اساتذہ میٹنگ',
      urduDescription: '<p>طلباء کی پیشرفت، تعلیمی کارکردگی پر بحث کرنے اور کسی بھی خدشات کو حل کرنے کے لیے سہ ماہی والدین-اساتذہ میٹنگ۔ تمام والدین کو شرکت کی حوصلہ افزائی کی جاتی ہے۔</p>',
      urduLocation: 'انتظامیہ عمارت، جامعہ عروہ',
    },
    {
      title: 'Ramadan Iftar Program',
      slug: 'ramadan-iftar-program',
      description: '<p>Daily iftar program during the holy month of Ramadan. Community iftar, Taraweeh prayers, and special religious lectures. Open to all community members.</p>',
      startAt: createDate(currentYear, currentMonth + 5, 1, 18, 0),
      endAt: createDate(currentYear, currentMonth + 5, 30, 20, 0),
      allDay: false,
      location: 'Prayer Hall & Dining Area, Jamia Urwaa',
      urduTitle: 'رمضان افطار پروگرام',
      urduDescription: '<p>رمضان المبارک کے مقدس مہینے کے دوران روزانہ افطار پروگرام۔ کمیونٹی افطار، تراویح کی نمازیں، اور خصوصی مذہبی لیکچرز۔ تمام کمیونٹی کے اراکین کے لیے کھلا۔</p>',
      urduLocation: 'نماز ہال اور کھانے کا علاقہ، جامعہ عروہ',
    },
    {
      title: 'Hadith Study Circle',
      slug: 'hadith-study-circle',
      description: '<p>Weekly study circle focusing on Hadith literature. Students will study authentic Hadith collections, learn about chain of narrators, and understand practical applications.</p>',
      startAt: createDate(currentYear, currentMonth + 1, 8, 15, 0),
      endAt: createDate(currentYear, currentMonth + 1, 8, 17, 0),
      allDay: false,
      location: 'Library, Jamia Urwaa',
      urduTitle: 'حدیث مطالعہ دائرہ',
      urduDescription: '<p>حدیث ادب پر توجہ مرکوز کرنے والا ہفتہ وار مطالعہ دائرہ۔ طلباء مستند حدیث کے مجموعوں کا مطالعہ کریں گے، راویوں کی زنجیر کے بارے میں سیکھیں گے، اور عملی اطلاقات کو سمجھیں گے۔</p>',
      urduLocation: 'لائبریری، جامعہ عروہ',
    },
    {
      title: 'Community Service Day',
      slug: 'community-service-day',
      description: '<p>Annual community service day where students and staff participate in various charitable activities, neighborhood cleanup, and helping those in need.</p>',
      startAt: createDate(currentYear, currentMonth + 4, 15, 8, 0),
      endAt: createDate(currentYear, currentMonth + 4, 15, 16, 0),
      allDay: false,
      location: 'Various Locations, Community Outreach',
      urduTitle: 'کمیونٹی سروس ڈے',
      urduDescription: '<p>سالانہ کمیونٹی سروس ڈے جہاں طلباء اور عملہ مختلف خیراتی سرگرمیوں، محلے کی صفائی، اور ضرورت مندوں کی مدد میں حصہ لیتے ہیں۔</p>',
      urduLocation: 'مختلف مقامات، کمیونٹی آؤٹ ریچ',
    },
  ];
}

