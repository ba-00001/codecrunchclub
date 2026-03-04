function onFormSubmit(e) {
  try {
    // Validate the event object
    if (!e || !e.values || !Array.isArray(e.values)) {
      console.error("Invalid event object or missing values array.");
      return;
    }

    // Safe value extraction with type checking
    function safeGetValue(index, defaultValue = "Not provided") {
      if (index >= e.values.length) return defaultValue;
      const value = e.values[index];
      return (value !== null && value !== undefined) ? String(value).trim() : defaultValue;
    }

    // Simplified form data extraction - only essential fields
    var formData = {
      timestamp: safeGetValue(0, "Not recorded"),              // Column A: Timestamp
      email: safeGetValue(1),                                  // Column B: Email Address
      fullName: safeGetValue(2),                               // Column C: First and Last Name
      schoolEmail: safeGetValue(3),                            // Column D: School email
      university: safeGetValue(4),                             // Column E: Full institution name
      //major: safeGetValue(26),                                 // Column AA: What is your Major? (index 26)
      //graduationYear: safeGetValue(24),                        // Column Y: What year do you graduate? (index 24)
      
      // Leadership and volunteer interest  
      executiveBoardInterest: safeGetValue(47, "None"),        // Column BI: Leadership team question (index 60)
      volunteerInterest: safeGetValue(55, "None")              // Column BQ: Volunteer question (index 68)
    };

 Logger.log('Processing registration for: ' + formData.fullName);

    // Validate essential fields
    if (formData.fullName === "Not provided" || !isValidEmail(formData.email)) {
      Logger.log('Missing essential information - skipping email');
      return;
    }

    // Send single, comprehensive welcome email
    sendWelcomeEmail(formData);

    // Send brief team notification
    sendTeamNotification(formData);

    Logger.log('Registration completed for: ' + formData.fullName);

  } catch (error) {
    Logger.log('Error processing form submission: ' + error.toString());
    // Optional: Send error notification to admin
    try {
      GmailApp.sendEmail("codecrunchhelp@outlook.com", 
        "Form Processing Error", 
        "Error: " + error.toString());
    } catch (e) {
      Logger.log('Failed to send error notification: ' + e.toString());
    }
  }
}

function sendWelcomeEmail(data) {
  var subject = "Welcome to Hack University - You're In!";
  
  var body = 'Hi ' + data.fullName + ',\n\n' +
'Welcome to Hack University! Your registration has been confirmed.\n\n' +
'REGISTRATION SUMMARY\n' +
'Name: ' + data.fullName + '\n' +
'School: ' + data.university + '\n' +
//'Major: ' + data.major + '\n' +
//'Graduation: ' + data.graduationYear + '\n\n' +
'WHAT\'S NEXT?\n\n' +
'CHECK YOUR REGISTRATION STATUS\n' +
'Visit the Hacker Guide at https://hackuniversity.vercel.app to see your entry registration and all programs you\'re enrolled in.\n\n' +
'JOIN DISCORD & GET COMMUNITY ACCESS\n' +
'Ready to connect with fellow participants? Join our Discord community:\n' +
'https://hackuniversity-discord.vercel.app\n' +
'Use the same email you registered with to get instant access to all resources!\n\n' +
// 'GET YOUR CERTIFICATES\n' +
// 'Tutorial: https://codecrunch-discordtutorial.vercel.app\n\n' +
'FOLLOW OUR EVENTS\n' +
'Calendar: https://hackuniversity-calendar.vercel.app\n\n' +
(data.executiveBoardInterest !== "None" && data.executiveBoardInterest !== "Not provided" && data.executiveBoardInterest.toLowerCase().includes('yes') ? 
'LEADERSHIP APPLICATION RECEIVED\n' +
'Schedule your interview thru **linkedin http://codecrunchlinkedin.vercel.app/**\n\n' : '') +
(data.volunteerInterest !== "None" && data.volunteerInterest !== "Not provided" && data.volunteerInterest.toLowerCase().includes('yes') ? 
'VOLUNTEER APPLICATION RECEIVED\n' +
'Schedule your interview thru **linkedin http://codecrunchlinkedin.vercel.app/**' : '') +
'Ready to build something amazing? Let\'s get started!\n\n' +
'Questions? Join our Discord or email codecrunchhelp@outlook.com\n\n' +
'Best regards,\n' +
'The Hack University Team';

  // Send to participant
  var recipientEmails = [];
  if (isValidEmail(data.email)) recipientEmails.push(data.email);
  if (isValidEmail(data.schoolEmail) && data.schoolEmail !== data.email) {
    recipientEmails.push(data.schoolEmail);
  }

  try {
    if (recipientEmails.length) {
      GmailApp.sendEmail(recipientEmails.join(","), subject, body, {
        cc: "codecrunchhelp@outlook.com",
        name: "Hack University Initiative"
      });
      Logger.log("Welcome email sent to: " + data.fullName);
    } else {
      Logger.log("No valid email addresses found for: " + data.fullName);
    }
  } catch (err) {
    Logger.log("Error sending welcome email: " + err);
  }
}

function sendTeamNotification(data) {
  var subject = 'New Registrant - ' + data.timestamp;
  
  var leadershipStatus = (data.executiveBoardInterest === "Not provided" || data.executiveBoardInterest === "") ? 'None' : data.executiveBoardInterest;
  var volunteerStatus = (data.volunteerInterest === "Not provided" || data.volunteerInterest === "") ? 'None' : data.volunteerInterest;
  
  var body = 'New registrant ' + data.timestamp + '\n' +

'Leadership: ' + leadershipStatus + '\n' +
'Volunteer: ' + volunteerStatus + '\n' +
'School: ' + data.university;

  // Team email list
  var teamEmails = [
  
  
    "pablovaldes0925@gmail.com",
    "pvald027@fiu.edu",

    "rubenotano13@gmail.com",
    "rubenotano13@gmail.com",

    "bg06101.BG@gmail.com",
    "bgarc211@fiu.edu",

    "amilcarjpp@gmail.com",
    "apena211@fiu.edu",

    "kencyfrancois@gmail.com",
    "kfran127@fiu.edu",

    "shellamp384@gmail.com",
    "aampu003@fiu.edu",

    "gastonibanezruiz@gmail.com",
    "giban012@fiu.edu",

    "jpiza008@fiu.edu",
    "jaedpizarro@gmail.com",

    "santymoravilla@gmail.com",
    "smora207@fiu.edu",

    "elacingir7@gmail.com",
    "ecing001@fiu.edu",

    "daniciancas@gmail.com",
    "dcian004@fiu.edu",

    
    "tlagu004.fiu@gmail.com",
    "tlagu004.fiu@edu",

        "tlagu004.fiu@gmail.com",
    "tlagu004.fiu@edu",

    "amilcarjpp@gmail.com",


    "jjosephe1216@gmail.com",
    "tlagu004.fiu@gmail.com"
 
  ];

  try {
    GmailApp.sendEmail("codecrunchhelp@outlook.com", subject, body, {
      cc: teamEmails.join(","),
      name: "Hack University - Team Notifications"
    });
    Logger.log("Team notification sent");
  } catch (err) {
    Logger.log("Error sending team notification: " + err);
  }
}

function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}