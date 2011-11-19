function thinkup_loadPage(callback) {
	$.getJSON(installation_url+"api/v1/post.php",
	{
		type: "user_posts",
		count: 20,
		include_replies: 1,
		username: username,
		page: page
	}, callback);
}