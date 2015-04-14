var moment = require('alloy/moment');
var user = model.attributes.user;

if (user.photo && user.phot.urls) {
	$.avatar.image = user.photo.urls.square_75 || user.photo.urls.thumb_100 || user.photo.urls.original;
}

$.comment.text = model.attributes.content;

//check for first name last name...
$.userName.text = (user.first_name || "") + " " + (user.last_name || "" );

//if no name then use the username
$.userName.text = $.userName.text.trim().length !== 0 ? $.userName.text.trim() : user.username;
$.date.text = moment (model.attributes.created_at).fromNow();

//Save the model id for user later
$.row.comment_id = model.id ||'';