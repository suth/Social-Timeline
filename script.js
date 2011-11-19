// Initial global variables
var page = 0;
var post_class = 'even';
var sourceScript;

// Document ready
$(document).ready(function() {


  // Add function to button
  $('#loadmore').click(function() {
    load_next_page();
  });
  
  // About modal
  $('#about-modal').modal({
  	backdrop: 'true'
  });
  
  load_next_page();

});

// Filter text
function filter_text(input) {
	input = input.replace(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig,"<a href='$1'>$1</a>");
	input = input.replace(/(^|\s)@(\w+)/g, "$1<a href='http://www.twitter.com/$2'>@$2</a>");
	input = input.replace(/(^|\s)#(\w+)/g, "$1<a href='http://search.twitter.com/search?q=%23$2'>#$2</a>");
	return input;
};


// Attachments
function construct_attachments(status, item) {
    var links = item.links;
	var attachments = document.createElement('div');
	attachments.className = 'attachments';
	for (var i = 0; i < links.length; i++) {
		url = links[i].expanded_url || links[i].url;
		if(!url) return;
		domain = url.split(/\/+/g)[1];
		if ( (domain=='www.youtube.com') || (domain=='twitter.com') || (domain=='www.vimeo.com') || (domain=='twitpic.com') ) {
			$(attachments).append('<a href="'+item.links[i].expanded_url+'" class="oembed">Attachment</a>');
		}
	}
	if (attachments.innerHTML!='') $(status).append(attachments);
}

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

function constructDate(created_at) {
    date = new Date(created_at);
    if ( date.getFullYear() != prev_date.getFullYear() ) {
        $("#timeline").append('<h2 id="'+date.getFullYear()+'" class="timestamp">'+date.getFullYear()+'</h2>');
        $('.secondary-nav').append('<li class="dropdown" data-dropdown="dropdown" id="'+date.getFullYear()+'-dropdown"><a href="#" class="dropdown-toggle">'+date.getFullYear()+'</a><ul class="dropdown-menu"></ul></li>');
    }
    if ( date.getFullYear()+date.getMonth() != prev_date.getFullYear()+prev_date.getMonth() ) {
        $("#timeline").append('<h3 id="'+date.getFullYear()+'-'+month[date.getMonth()]+'" class="timestamp">'+month[date.getMonth()]+'</h3>');
        $("#"+date.getFullYear()+"-dropdown > .dropdown-menu").append('<li><a href="#'+date.getFullYear()+'-'+month[date.getMonth()]+'">'+month[date.getMonth()]+'</a></li>');
    }
    if ( date.getFullYear()+date.getMonth()+date.getDate() != prev_date.getFullYear()+prev_date.getMonth()+prev_date.getDate() ) {
        $("#timeline").append('<h4 id="'+date.getDate()+'" class="timestamp">'+date.getDate()+'<sup>'+get_nth_suffix(date.getDate())+'</sup></h4>');
    }
    return date;
}

// Expand URLs
function expand_urls(status, links) {
	for (var i = 0; i < links.length; i++) {
		status = status.replace(links[i].url, links[i].expanded_url);
	}
	return status;
}

// Construct status block
function construct_status(item) {
    prev_date = constructDate(item.created_at);
	var status = document.createElement('div');
	status.className = 'post ' + post_class;
	status_text = expand_urls(item.text, item.links)
	status_text = filter_text(status_text);
	$(status).append("<div class='original-post'><img src='"+item.user.profile_image_url+"' title='@"+item.user.screen_name+"' class='avatar' width='48' height='48'><p>"+status_text+"</p><span class='clearfix'></span></div>");
	if (item.links[0]) construct_attachments(status, item);
	if (item.replies) {
	    var replies = document.createElement('div');
	    replies.className = 'replies';
	    $.each(item.replies, function(i,item){
	    	if (item.user) {
	    	$(replies).append("<div class='reply'><img src='"+item.user.profile_image_url+"' title='@"+item.user.screen_name+"' class='avatar' width='48' height='48'><p>"+filter_text(item.text)+"</p><span class='clearfix'></span></div>");
	    	} else {
	    	$(replies).append("<div class='reply'><img src='' class='avatar' width='48' height='48'><p>"+filter_text(item.text)+"</p><span class='clearfix'></span></div>");
	    	}
	    });
	    $(status).append(replies);
	};
	$("#timeline").append(status);
	$(".oembed").embedly({key:embedly_key,width:920,maxWidth:920});
};

// Load next page
function load_next_page() {
	page++;
	load_statuses();
	return false;
}

// Request statuses
var intervalId = 0;;
function load_statuses() {
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
	loadPage(function(data) {
		  for (var i = 0; i < data.length; i++) {
			if (post_class == 'even') { post_class = 'odd'; } else { post_class = 'even'; };
			construct_status(data[i]);
		  };
		  $("a.oembed").embedly({key:embedly_key, width:920, maxWidth:920});
		  clearInterval(intervalId);
		  var loadButton = document.getElementById('loadmore');
		  loadButton.disabled = false;
		  loadButton.innerHTML = 'Load more';
		}
	);
};
