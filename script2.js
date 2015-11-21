//var base = [{type:"tag",id:"new1",name:"KLab",clicks:"2"},{type:"tag",id:"new2",name:"HLab",clicks:"3"},{type:"task",title:"Сделать Task Tracker",description:"blabla",priority:"5",user:"Olga",id:"task1",tags:["KLab","HLab"]},{type:"task",title:"Сделать облако тегов",description:"запросто",priority:"3",user:"Vika",id:"task2",tags:["KLab","Others"]}];
var base;

/*function Load(callback){
		Net.GET(
		'http://sandbox.web-manufacture.net/lorelei/storage.json',
		callback);
	}

function Save(){
		Net.POST(
			'http://sandbox.web-manufacture.net/lorelei/storage.json',
			JSON.stringify(base),
			function(){	});
	}

WS.DOMload(function () {		
	Load(function(data){
			base = data;
			displayTags();	
			displayUsers();
		});*/

$(document).ready(function () {
    
	$.get(
		'https://api.myjson.com/bins/46ff4',
		onAjaxSuccess
	).done(function(){
		displayTags();	
		displayUsers();
	});
	
			
	$('#add_task').on('click', function() {
		$('.form').animate({
			'width':'400px',
		});
	});	
	
	dropTag = new DropItem();
	dropName = new DropItem();
	dropTag.make($('#drop_tag'), 'tag');
	dropName.make($('#drop_user'), 'user');
	
	$('#save').on('click', function(){
		addTask();
		hideForm();
	});
	
	$('#cancel').on('click', function(){
		hideForm();
	});
	
	$('.cloud').on('click', 'a', showTasks);
	$('.cloud').on('click', 'a', countClicks);
	$('#add_tag').on('click', addNewTag);
	
	$('.content').on('click', 'div.task', function() {
		var task = $(this);
		task.animate({
			'height': '300px',
			});
		task[0].style.background = 'grey';
		var divs = task.find('.panel').children();
		for (var i=0;i<divs.length;i++) {
			var row = divs[i].textContent;
			alert(row);
			divs[i].innerHTML ='<input type="text" value="'+row+'">';
			event.preventDefault();
			event.stopPropagation(); 
		}
		return false; 
	});
});

	function onAjaxSuccess(data) {
		base = data;
	}
	
	function displayTags() {
		var row = '';
		var cloud = $('div.cloud');
		for (var i=0;i<base.length;i++) {
			if(base[i].type !== "tag") continue;
			var tag = base[i];
			row = row +'<a href="#">'+tag.name+'</a>';
		}
		cloud.html(row);
		makeDraggable($('div.cloud a'), "tag");
	}
	
	function addNewTag() {
		var new_tag = {};
		new_tag.type = "tag";
		if($('input[name="New Tag"]').val() == '') {
			alert('Nothing is to add');
			return false;
		}
        new_tag.name = $('input[name="New Tag"]').val();
		new_tag.clicks = "1";
		base.push(new_tag);
		$('.cloud').append('<a href=#>'+new_tag.name+'</a>');
		$('input[name="New Tag"]').val('');
		makeDraggable($('div.cloud a'), "tag");
	}
	
	function displayUsers() {
		var row = "";
		var users_wrap = $('.users-wrap');
		for (var i=0;i<base.length;i++) {
			if ("user" in base[i]) {
				row = row+'<li><a href=#>'+base[i].user+'</a></li>';
			}
		}
		users_wrap.html(row);
		makeDraggable($('li a'), "user");
	}
	
	function countClicks() {
		var link = $(this);
		for (var i=0;i<base.length;i++) {
			if(base[i].type !== "tag") continue;
			var tag = base[i];
			if (tag.name == link.text() ) {
			var click = parseInt(tag.clicks);
			++click;
			var FONT_SIZE = 11;
			var font = click + FONT_SIZE;
			link[0].style.fontSize = font+'px';
			tag.clicks = click;
		};
	};
	}
	
	function showTasks() {
		var link = $(this);
		var row = '';
		var tasks_wrap = $('#tasks_wrap');
		var usersWrap = '<div class="task-executor">';
        var tagsWrap = '<div class="task-tags">';
		tasks_wrap.html(row);
		for (var i=0;i<base.length;i++) {
			if (base[i].type == "task") {
				var task = base[i];
				var users_arr =task.user;
				var tags_arr = task.tags;
				for (var j=0;j<tags_arr.length;j++) {
					if (tags_arr[j] == link.text() ) {
						$('#tasks_wrap').append(createTaskWrap(task));
					}
				}
			}
		}
	}
			
    function addTask() {
        var users = makeArr("user");
		var tags = makeArr("tag");
		var task = {
			type: "task",
			title: $('input[name="title"]').val(),
			description: $('textarea[name="description"]').val(),
			priority: $('input[name="priority"]').val(),
			user: users,
			id: ("task-"+Math.random()).replace("0.",""),
			tags: tags,
            date: (new Date()).toLocaleString(),
		};
		base.push(task);
		$('#tasks_wrap').append(createTaskWrap(task));
		//clear inputs after saving new task
		$('input').val('');
		$('textarea').val('');
		
    }
	
	function createTaskWrap(task) {
		var usersWrap = '<div class="task-executor">';
        var tagsWrap = '<div class="task-tags">';
		// create div with new task
		var newTask = document.createElement('div');
		newTask.className = 'task';
		//add column of buttons
		var btnCol = document.createElement('ul');
		btnCol.className = 'btn-col';
		btnCol.innerHTML = '<li class="add-btn"><a href="#">Delete</a></li><li class="add-btn"><a href="#">Small</a></li><li class="add-btn"><a href="#">Large</a></li>';
		newTask.appendChild(btnCol);
		//tasks information
		var topElements = document.createElement('div');
		topElements.className = "top panel";
		topElements.innerHTML = createRow("user",usersWrap,task.user)+'<div class="task-title">'+task.title+'</div><div class="date">'+task.date+'</div>';
		newTask.appendChild(topElements);
		var bottomElements = document.createElement('div');
		bottomElements.className = "bottom panel";
		bottomElements.innerHTML = '<div class="task-descr">'+task.desription+'</div>'+'<div class="task-priority">Priority:<br>'+task.priority+'</div>'+createRow("tag",tagsWrap,task.tags)+'</div>';
		newTask.appendChild(bottomElements);
		newTask.appendChild(createClearDiv());
		return newTask;
	}
	
	function createClearDiv(){
		var clearElem = document.createElement('div');
		clearElem.className = 'clear';
		return clearElem;
	}
	
	//create data array
	function makeArr(type) {
		var str = $('input[name='+type+']').val();
		return str.split(',');
	}
	
    //create div with links    
     function createRow(type,wrap,arr) {
           	var newRow = wrap;
            for (var j=0;j<arr.length;j++) {
                newRow = newRow+'<a href="#">'+arr[j]+'</a>';
            }
            newRow = newRow +'</div>';
			return newRow;
          }
        
	function DropItem(dropElem, type) {
		this.arr = [];
		var that = this;
		this.make = function(dropElem, type) {	
			dropElem.droppable( {
				drop: function(event, ui) {
					var draggable = ui.draggable;
					that.arr.push(ui.draggable.text());
					$('input[name='+type+']').val(that.arr);
					},
				scope: type,
				activate: function() {
					dropElem.css({
					border: "medium double green",
					backgroundColor: "lightGreen"
				});
				},
				deactivate: function() {
					dropElem.css("border", "").css("background-color", "");
				}
		});
		};
		this.clear = function() {
			this.arr = [];
		};
	}	
	
	
	function makeDraggable(elem, type) {
		elem.draggable({
			helper: "clone",
			scope: type,
			snap: type,
			snapTolerance: 50
		});
	}
	
	function hideForm() {
		$('.form').animate({
			'width':'0px',
		});
		dropTag.clear();
		dropName.clear();
		$('input').val('');
		$('textarea').val('');
	}
	
	
	
	
	
	
	
	
	
	
	
	