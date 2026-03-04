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

 Logger.log('Processing OneStop Form submission for: ' + formData.fullName);

    // Validate essential fields
    if (formData.fullName === "Not provided" || !isValidEmail(formData.email)) {
      Logger.log('Missing essential information - skipping OneStop confirmation email');
      return;
    }

    // Send single, comprehensive welcome email
    sendWelcomeEmail(formData);

    // Send brief team notification
    sendTeamNotification(formData);

    Logger.log('OneStop Form submission processed for: ' + formData.fullName);

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
  var subject = "Hack University OneStop Form Submission Confirmed";
  var leadershipApplied = (data.executiveBoardInterest !== "None" && data.executiveBoardInterest !== "Not provided" && data.executiveBoardInterest.toLowerCase().includes('yes')) ? 'Yes' : 'No';
  var volunteerApplied = (data.volunteerInterest !== "None" && data.volunteerInterest !== "Not provided" && data.volunteerInterest.toLowerCase().includes('yes')) ? 'Yes' : 'No';
  
  var body = 'Hi ' + data.fullName + ',\n\n' +
'Your Hack University OneStop Form submission has been received. This shared form is used across all participating organizations to record membership, event registration, and access requests.\n\n' +
'HACK UNIVERSITY ONESTOP FORM\n' +
'A centralized student portal supported by Google Developer Group at Florida International University (GDG at FIU), Code Crunch, ColorStack at FIU, CAHSI at FIU, and Raspberry Pi Code Crunch - one place to join our organizations - where participants collaborate through problem-solving competitions such as hackathons, mentorship-driven challenges, and hands-on projects, access community platforms, register for hackathons, the Code to Cash Competitions: AI Skills for the Modern Business Center, sponsor competitions, and sync important dates to their calendars.\n\n' +
'MEMBERSHIP SUMMARY\n' +
'Name: ' + data.fullName + '\n' +
'School: ' + data.university + '\n' +
//'Major: ' + data.major + '\n' +
//'Graduation: ' + data.graduationYear + '\n\n' +
'WHAT\'S NEXT?\n\n' +
'CHECK YOUR MEMBERSHIP STATUS\n' +
'Use the same Gmail/Google account you used on the OneStop Form to verify your membership, register or update event participation, unlock Discord, Private IG Group, GroupMe, Teams, and download your official membership certificate.\n\n' +
'Visit the Hacker Guide at https://hackuniversity.vercel.app to review your Hack University membership, event registrations, and organization access.\n\n' +
'COMMUNITY CALENDAR (OPEN TO EVERYONE)\n' +
'View and subscribe to our official Google Calendar for event links, and add upcoming dates to your own Google Calendar.\n\n' +
'JOIN DISCORD & GET COMMUNITY PLATFORMS ACCESS\n' +
'Ready to connect with fellow participants? Join our Discord community, Instagram Group Chat, GroupMe Group Chat, and Teams:\n' +
'https://hackuniversity-discord.vercel.app\n' +
'Organization Discords (Google Developer Group at FIU, Code Crunch Worldwide, CAHSI at FIU, ColorStack at FIU, Raspberry Pi Code Crunch, Swift Org at FIU) unlock after login through the All-In-One Student Access portal using the same Gmail account you used on the OneStop Form.\n\n' +
// 'GET YOUR CERTIFICATES\n' +
// 'Tutorial: https://codecrunch-discordtutorial.vercel.app\n\n' +
'ALL-IN-ONE STUDENT ACCESS\n' +
'Verify your membership, manage main event registrations, unlock community platforms, download certificates, and confirm volunteer or leadership participation - all using the same Gmail account you used on the OneStop Form.\n\n' +
'PASSWORD LOGIN NOTE\n' +
'Coming soon: by default, your login password is blank or set by you if you registered your email after January 2026. You may update your password anytime by updating the OneStop Form.\n\n' +
'FOLLOW OUR EVENTS\n' +
'Calendar: https://hackuniversity-calendar.vercel.app\n\n' +
'LEADERSHIP APPLICATION STATUS: ' + leadershipApplied + '\n' +
'VOLUNTEER APPLICATION STATUS: ' + volunteerApplied + '\n' +
'Applications are open year-round. If you did not apply today, feel free to update your volunteer or leadership application at any time with the OneStop Form and reach us on LinkedIn to schedule an interview: http://codecrunchlinkedin.vercel.app/\n\n' +
'Our monthly Hackathon Series - Sponsored by Google Developer Group at FIU\n\n' +
'305 Hackathon Series\n' +
'CodeFest Hackathon\n' +
'HACK FIESTA MIAMI\n' +
'CodeStorm Hackathon\n' +
'SummerCodex\n' +
'EmpowHer Hackathon\n' +
'Devfest Hackathon\n\n' +
'Ready to build something amazing? Let\'s get started!\n\n' +
'Questions?\n' +
'Google Developer Club at FIU - https://linkedin.com/company/gdgatfiu\n' +
'Code Crunch Worldwide - https://linkedin.com/company/code-crunch-club\n' +
'ColorStack at FIU - https://linkedin.com/company/color-stack-at-fiu\n' +
'CAHSI at FIU - https://linkedin.com/company/cahsi-at-fiu-club\n' +
'Raspberry Pi Code Crunch - https://linkedin.com/company/raspberrypicodecrunch\n\n' +
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
  var subject = 'Hack University OneStop Form Submission - ' + data.timestamp;
  
  var leadershipStatus = (data.executiveBoardInterest === "Not provided" || data.executiveBoardInterest === "") ? 'None' : data.executiveBoardInterest;
  var volunteerStatus = (data.volunteerInterest === "Not provided" || data.volunteerInterest === "") ? 'None' : data.volunteerInterest;
  
  var body = 'A Hack University OneStop Form submission was completed.\n' +
'Timestamp: ' + data.timestamp + '\n' +
'\n' +
'Shared Portal Access: Membership, hackathons, special events, certificates, Discord, and GroupMe\n' +
'Leadership: ' + leadershipStatus + '\n' +
'Volunteer: ' + volunteerStatus + '\n' +
'School: ' + data.university;

  var teamEmails = getValidUniqueEmails(getTeamEmails());

  try {
    if (!teamEmails.length) {
      Logger.log("No valid team email addresses found");
      return;
    }

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

function runTestOneStopSubmission() {
  // Manual Apps Script test helper that sends a real email using mock form values.
  var testData = {
    timestamp: new Date().toLocaleString(),
    email: "jaedpizarro@gmail.com",
    fullName: "Jaed Pizzarro",
    schoolEmail: "jpiza008@fiu.edu",
    university: "Florida International University",
    executiveBoardInterest: "Yes",
    volunteerInterest: "Yes"
  };

  sendWelcomeEmail(testData);
  sendTeamNotificationTestToAll(testData);
}

function sendTeamNotificationTestToAll(data) {
  var subject = 'TEST REGISTRATION ONESTOP FORM - Hack University OneStop Form Submission - ' + data.timestamp;
  var leadershipStatus = (data.executiveBoardInterest === "Not provided" || data.executiveBoardInterest === "") ? 'None' : data.executiveBoardInterest;
  var volunteerStatus = (data.volunteerInterest === "Not provided" || data.volunteerInterest === "") ? 'None' : data.volunteerInterest;
  var body = 'A Hack University OneStop Form submission was completed.\n' +
'Timestamp: ' + data.timestamp + '\n' +
'\n' +
'Shared Portal Access: Membership, hackathons, special events, certificates, Discord, and GroupMe\n' +
'Leadership: ' + leadershipStatus + '\n' +
'Volunteer: ' + volunteerStatus + '\n' +
'School: ' + data.university;
  var teamEmails = getValidUniqueEmails(getTeamEmails());

  try {
    if (!teamEmails.length) {
      Logger.log("No valid team email addresses found for test send");
      return;
    }

    GmailApp.sendEmail(teamEmails.join(","), subject, body, {
      name: "Hack University - Team Notifications"
    });
    Logger.log("Team test notification sent to all team members in TO");
  } catch (err) {
    Logger.log("Error sending team test notification: " + err);
  }
}

function getTeamEmails() {
  return [
    "pablovaldes0925@gmail.com",
    "pvald027@fiu.edu",
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
    "jjosephe1216@gmail.com"
  ];
}

function getValidUniqueEmails(emails) {
  var seen = {};
  var validEmails = [];
  var skippedEmails = [];

  for (var i = 0; i < emails.length; i++) {
    var email = String(emails[i] || "").trim();
    if (!isValidEmail(email)) {
      if (email) skippedEmails.push(email);
      continue;
    }

    var key = email.toLowerCase();
    if (seen[key]) continue;

    seen[key] = true;
    validEmails.push(email);
  }

  if (skippedEmails.length) {
    Logger.log("Skipped invalid team emails: " + skippedEmails.join(", "));
  }

  return validEmails;
}
