// Universal Embedly key
var embedly_key = 'EMBEDLY_KEY'; // Embed.ly API key


// Now, comment out the one you *aren't* using (ThinkUpApp or Locker):

// ThinkUpApp settings
var installation_url = 'http://think.up/directory/'; // URL of your ThinkUp installation (include trailing slash)
var username = 'username'; // Username for the Twitter account to display
var loadPage = thinkup_loadPage; // leave this as is

// Locker/Singly settings, choose an installation URL based on
var loadPage = locker_loadPage; // leave this as is
var installation_url = 'http://localhost:8042/'; // For Locker
var installation_url = 'https://api.singly.com/<your-singly-api-key>/'; // For Singly, don't expose your Singly API key to the public!!!