function locker_loadPage(callback) {
    $.getJSON(installation_url + "synclets/twitter/getCurrent/tweets", function(tweets) {
        $.getJSON(installation_url + "synclets/twitter/getCurrent/mentions", function(timeline) {
            for (var i in timeline) tweets.push(timeline[i])
            tweets.sort(function(a, b) {
                a = new Date(a.created_at);
                b = new Date(b.created_at);
                if (a < b) return 1;
                if (a > b) return -1;
                return 0;
            });
            var data = tweets;
            var newData = [];
            for (var i in data) {
                var item = data[i];
                var obj = {
                    created_at: item.created_at,
                    text: item.text,
                    user: {
                        profile_image_url: item.user.profile_image_url,
                        screen_name: item.user.screen_name,
                    }
                };
                if (item.entities && item.entities.urls) {
                    var links = item.entities.urls;
                    var newLinks = [];
                    for (var i in links) {
                        newLinks.push({
                            url: links[i].url,
                            expanded_url: links[i].expanded_url
                        });
                    }
                    obj.links = newLinks;
                }
                if (item.replies) {
                    var replies = item.replies;
                    var newReplies = [];
                    for (var i in replies) {
                        var reply = replies[i];
                        var newReply = {};
                        if (reply.text)
                        newReply.text = reply.text;
                        if (reply.user) {
                            newReply.user = {
                                profile_image_url: reply.user.profile_image_url,
                                screen_name: reply.user.screen_name
                            };
                        }
                        newReplies.push(newReply);
                    }
                    obj.replies = newReplies;
                }
                newData.push(obj);
            }
            
            // phew!
            callback(newData);
        });
    });
}