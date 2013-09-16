// Initial global variables
var page = 0;
var post_even = false;

var post_template;

Handlebars.registerHelper('filtered_text', function() {
	return new Handlebars.SafeString(
		text_filter( expand_urls( this.text, this.links) )
	);
});

Handlebars.registerHelper('friendly_time', function() {
	var date = new Date(this.created_at);
	var hour = date.getHours();
	var min = ("0" + date.getMinutes()).slice(-2);
	var ampm = hour < 12 ? "am" : "pm";
	hour = hour % 12 || 12;  // convert to 12-hour format
	return new Handlebars.SafeString(
		hour + ":" + min + "&nbsp;" + ampm
	);
});

// Document ready
$(document).ready(function() {

	post_template = Handlebars.compile( $('#entry-template').html() );

	// Load first page
	load_next_page();

	// Add function to button
	$('#loadmore').click(function() {
		load_next_page();
	});

	// About modal
	// $('#about-modal').modal({
	// 	backdrop: 'true'
	// });

});

// Filter text
function text_filter(input) {
	input = input.replace(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig,function(url){
		if (url.length>50) {
			visible_url = url.substr(0,47) + '...';
		} else {
			visible_url = url;
		}
		return "<a href='"+url+"'>"+visible_url+"</a>";
	});
	input = input.replace(/(^|\s)@(\w+)/g, "$1<a href='http://www.twitter.com/$2'>@$2</a>");
	input = input.replace(/(^|\s)#(\w+)/g, "$1<a href='http://search.twitter.com/search?q=%23$2'>#$2</a>");
	return input;
};

// Expand URLs
function expand_urls(status, links) {
	for (var i = 0; i < links.length; i++) {
		status = status.replace(links[i].url, links[i].expanded_url);
	}
	return status;
}

// Attachments
function construct_attachments(links) {
	var attachments = $('<div class="attachments"></div>');
	for (var i = 0; i < links.length; i++) {
		url = links[i].expanded_url;
		domain = url.split(/\/+/g)[1];
		if ( $.inArray( domain, allowed_attachment_domains ) != -1 ) {
			attachments.append($('<a href="'+url+'" class="oembed">Attachment</a>'));
		}
	}
	if (attachments.innerHTML!='') $("#timeline").append(attachments);
}

// Construct status block
function construct_status(currentItem) {
	$("#timeline").append(post_template(currentItem));
	if (currentItem.links[0]) construct_attachments(currentItem.links);
};

// Date handling
var prev_date = new Date('0');
var month=new Array(12);
month[0]="January";
month[1]="February";
month[2]="March";
month[3]="April";
month[4]="May";
month[5]="June";
month[6]="July";
month[7]="August";
month[8]="September";
month[9]="October";
month[10]="November";
month[11]="December"
function get_nth_suffix(date) {
    switch (date) {
    case 1:
    case 21:
    case 31:
        return 'st';
    case 2:
    case 22:
        return 'nd';
    case 3:
    case 23:
        return 'rd';
    default:
        return 'th';
    }
}

// Request statuses
var intervalId = 0;;
function load_statuses(installation_url,username,page) {
	var loadButton = document.getElementById('loadmore');
	loadButton.disabled = true;
	loadButton.innerHTML = 'Loading...';
	intervalId = window.setInterval(function(){
		if(loadButton.innerHTML == 'Loading...'){
			loadButton.innerHTML = 'Loading';
		} else{
			loadButton.innerHTML += '.';
		}
	}, 300);
	$.getJSON(installation_url+"api/v1/post.php",
		{
			type: "user_posts",
			count: posts_per_page,
			include_replies: 1,
			username: username,
			page: page
		},
		function(data) {
			console.log(data);
		  for (var i = 0; i < data.length; i++) {
			currentItem = data[i];
			
date = new Date(currentItem.created_at);
if ( date.getFullYear() != prev_date.getFullYear() ) {
	$("#timeline").append('<h2 id="'+date.getFullYear()+'" class="timestamp"><span class="date">'+date.getFullYear()+'</span></h2>');
	$('#date-nav').append('<li class="dropdown" data-toggle="dropdown" id="'+date.getFullYear()+'-dropdown"><a href="#" class="dropdown-toggle">'+date.getFullYear()+'</a><ul class="dropdown-menu" role="menu"></ul></li>');
}
if ( date.getFullYear()+date.getMonth() != prev_date.getFullYear()+prev_date.getMonth() ) {
	$("#timeline").append('<h3 id="'+date.getFullYear()+'-'+month[date.getMonth()]+'" class="timestamp"><span class="date">'+month[date.getMonth()]+'</span></h3>');
	$("#"+date.getFullYear()+"-dropdown > .dropdown-menu").append('<li><a href="#'+date.getFullYear()+'-'+month[date.getMonth()]+'">'+month[date.getMonth()]+'</a></li>');
}
if ( date.getFullYear()+date.getMonth()+date.getDate() != prev_date.getFullYear()+prev_date.getMonth()+prev_date.getDate() ) {
	$("#timeline").append('<h4 id="'+date.getDate()+'" class="timestamp"><span class="date">'+date.getDate()+'<sup>'+get_nth_suffix(date.getDate())+'</sup></span></h4>');
}
prev_date = date;
			
			currentItem.even = post_even;
			construct_status(currentItem);
			if (post_even == true) { post_even = false; } else { post_even = true; };
		  };
		  $("a.oembed").embedly({key:embedly_key, width:920, maxWidth:920});
		  clearInterval(intervalId);
		  var loadButton = document.getElementById('loadmore');
		  loadButton.disabled = false;
		  loadButton.innerHTML = 'Load more';
		}
	);
};

// Request single status
function load_status(status_id) {
	$.getJSON(installation_url+"api/v1/post.php",
		{
			post_id: status_id
		},
		function(data) {
			return data;
		}
	);
};

// Load next page
function load_next_page() {
	page++;
	load_statuses(installation_url,username,page);
	return false;
}