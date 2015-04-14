var comments = Alloy.Collections.instance("Comment");

//Get the parameters passed into the controller
var parameters = arguments[0] || {};
var currentPhoto = parameters.photo || {};
var parentController = parameters.parentController || {};
$.commentTable.addEventListener("delete", handleDeleteRow);
$.commentTable.addEventListener("longpress", handleDeleteRow);
$.commentTable.editable = true;

function handleDeleteRow(_event){
	var collection = Alloy.Collections.instance("Comment");
	var model = collection.get(_event.row.comment_id);
	
	if (!model){
		alert("Could not find selected comment");
		return;
	}else{
		if(OS_ANDROID){
			var optionAlert = Titanium.UI.createAlertDialog({
				title: 'Alert',
				message : 'Are you sure you want to delete the comment?', 
				buttonNames : ['Yes', 'No'],
			});
			
			optionAlert.addEventListener('click', function(e){
				if (e.index == 0){
					deleteComment(model);
				}
			});
			optionAlert.show();
		}else{
			deleteComment(model);
		}
	}
}

function deleteComment (_comment){
	_comment.destroy({
		data : {
			photo_id : currentPhoto.id, //comment on
			id : _comment.id //id of the object 
		},
		success : function(_model, _response){
			loadComments(null);
		},
		error : function(_e){
			Ti.API.error('error: ' + _e.message);
			alert("Error deleting comment");
			loadComments(null);
		}
	});
}


function loadComments(_photo_id){
	var params = {
		photo_id : currentPhoto.id,
		order : '-created_at',
		per_page : 100,
	};
	var rows = [];
	
	comments.fetch({
		data : params,
		success : function(model, response) {
			comments.each(function(comment) {
				var commentRow = Alloy.createController("commentRow", comment);
				rows.push(commentRow.getView());
			});
			//set the table rows
			$.commentTable.data = rows;
		},
		
		error : function(error) {
			alert('Error loading comments ' + e.message);
			Ti.API.error(JSON.stringify(error));
		}
	});
}

$.initialize = function(){
	loadComments();
};


function doOpen() {
	if (OS_ANDROID) {
		var activity = $.getView().activity;
		var actionBar = activity.actionBar;
		
		activity.onCreateOptionsMenu = function (_event){
			
			if (actionBar) {
				actionBar.displayHomeAsUp = true;
				actionBar.onHomeIconItemSelected = function(){
					$.getView().close();
				};
			}else{
				alert("No Action Bar Found");
			}
			
			//add the button/menu to the titlebar
			var menuItem = _event.menu.add({
				title : "New Comment",
				showAsAction : Ti.Android.SHOW_AS_ACTION_ALWAYS,
				icon : Ti.Android.R.drawable.ic_menu_edit
			});
			
			//event listener
			menuItem.addEventListener("click", function(e) {
				handleNewCommentButtonClicked();
			});
		};
	}
};

OS_IOS && $.newCommentButton.addEventListener("click", handleNewCommentButtonClicked);

function handleNewCommentButtonClicked(_event){
	var navWin;
	var inputController = Alloy.createController("commentInput",{
		photo : currentPhoto,
		parentController : $,
		callback : function (_event){
			inputController.getView().close();
			inputCallback(_event);
		}
	});
	//open the window
	inputController.getView().open();
}


function inputCallback(_event){
	if (_event.success){
		addComment(_event.content);
	}else{
		alert("No Comment Added");
	}
}
