exports.definition = {
	config: {

		adapter: {
			type: "acs",
			collection_name: "reviews"
		}
	},
	extendModel: function(Model) {
		_.extend(Model.prototype, {});

		return Model;
	},
	extendCollection: function(Collection) {
		_.extend(Collection.prototype, {
			// extended functions and properties go here
		});

		return Collection;
	}
};

function addComment(_content){
	var comment = Alloy.createModel('Comment');
	var params = {
		photo_id : currentPhoto.id,
		content : _content,
		allow_duplicate : 1,
	};
	
	comment.save(params, {
		success : function (_model, _response){
			Ti.API.info('success'  + _model.toJSON());
			var row = Alloy.createController("commentRow", _model);
			
			//add the controller view, which is a row to the table
			if ($.commentTable.getData().length === 0){
				$.commentTable.setData([]);
				$.commentTable.appendRow(row.getView(), true);
			}else{
				$.commentTable.insertRowBefore(0, row.getView(), true);
			}
		},
		error : function(e){
			Ti.API.error('error: ' + e.message);
		}
	});
};