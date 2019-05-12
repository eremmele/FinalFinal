$(function(){

	function getProperty( propertyName, object ) {
	  var parts = propertyName.split( "." ),
	    length = parts.length,
	    i,
	    property = object || this;

	  for ( i = 0; i < length; i++ ) {
	    property = property[parts[i]];
	  }

	  return property;
	}

	var setLoop;

	function tickerLoop(link){
		var tickerWidth = link.find(".sliding-pages_ticker-content").width();
		var counter = 0;
		setLoop = setInterval(function(){
			if (counter >= tickerWidth){
				counter = 0;
			}
			else{
				counter +=1;
			}
			link.find(".sliding-pages_ticker").css("-moz-transform", "translate(-"+counter+"px, 0)");
			link.find(".sliding-pages_ticker").css("-o-transform", "translate(-"+counter+"px, 0)");
			link.find(".sliding-pages_ticker").css("-ms-transform", "translate(-"+counter+"px, 0)");
			link.find(".sliding-pages_ticker").css("-webkit-transform", "translate(-"+counter+"px, 0)");
			link.find(".sliding-pages_ticker").css("transform", "translate(-"+counter+"px, 0)");
		}, 10);
	}

	function tickerEnd(){
		clearInterval(setLoop);
	}

	$(".sliding-pages_link").mouseenter(function(e){
		var link = $(this);
		tickerLoop(link);
	});

	$(".sliding-pages_link").mouseleave(function(e){
		tickerEnd();
	});

	var currentPage;

	window.onpopstate = function(event) {
		locationChange();
	};

	$(window).load(function() {
		locationChange();
	});

	function locationChange() {
		var url = window.location.href;
		$("*").css("transition", "none !important");

		var categories = ["exhibits", "essays", "credits", "events", "visit"];

		if (url.indexOf("?") > -1) {

			var category = false;

			for (i = 0 ; i < categories.length; i++) {
				if (url.indexOf(categories[i]) > -1) {
					var category = url.split("=").pop();
					var selector = "#" + category + " .sliding-pages_link";
					console.log(selector);
					$(selector).click();
					category = true;
				}
			}

			if (category === false) {
				var category = url.split("=").pop();
				var essays = ['give-fake-a-chance', 'the-truth-about-the-real-fake-fake', 'bird-do-it-bees-do-it', 'how-our-brain-judges-real-from-fake'];
				var essay = false;

				for (i = 0 ; i < essays.length; i++) {
					if (url.indexOf(essays[i]) > -1) {
						essay = true;
					}
				}

				if (essay === true) {
					$("#essays .sliding-pages_link").click();
				} else {
					$("#exhibits .sliding-pages_link").click();
				}

				setTimeout(function(){
					$(".inner-link[data-slug = '"+category+"']").click();
				}, 2000);
			}
		}
	}

	$('.marquee').marquee();

	// home page sliding links
	$(".sliding-pages_link").click(function(e){
		e.preventDefault();

		$(this).parent().nextAll().removeClass("active");
		$(this).parent().prevAll().addClass("active");
		$(this).parent().addClass("active");
		$(".sliding-pages_link").removeClass("active");
		$(this).addClass("active");

		currentPage = $(this).parent().attr("id");

		//routing
		const params = new URLSearchParams(location.search);
		params.set('page', currentPage);
		window.history.pushState({}, '', `${location.pathname}?${params}`);

        $.getJSON('data.json',{
          format: 'json'
        }).success(function(data){
        	var JSONObject = getProperty(currentPage, data)
			if (JSONObject) {
				loadJSONUpper(JSONObject, currentPage);
				setTimeout(function(){
					scrollToElement(currentPage)
				}, 2000);
			}
        });
	});

	function loadJSONUpper(JSONObject, currentPage) {
		var selector = '#'+currentPage
		$(selector).find(".sliding-pages_container").remove();
		$(selector).append('<div class="sliding-pages_container no-padding"></div>')
		if (currentPage == "exhibits") {
			$(selector).find('.sliding-pages_container').append('<div class="page-col page-col--one"></div><div class="page-col page-col--two"></div>');
			$.each(JSONObject, function(index, value){
				$.ajax({
				    url:'images/exhibitImages/'+value.slug+'.jpg',
				    type:'HEAD',
				    error: function()
				    {
				        if (index%2 == 0 && (index!==28 && index!==30)) {
							$(selector).find(".sliding-pages_container .page-col--one").append('<div class="page-col_link inner-link page-col_link--imageless" data-index="'+index+'" data-slug="'+value.slug+'"><h3><span>'+value.title+'</span></h3></div>');
						}
						else if (index==28 && index==30) {
							$(selector).find(".sliding-pages_container .page-col--two").append('<div class="page-col_link inner-link page-col_link--imageless" data-index="'+index+'" data-slug="'+value.slug+'"><h3><span>'+value.title+'</span></h3></div>');
						}
						else {
							$(selector).find(".sliding-pages_container .page-col--two").append('<div class="page-col_link inner-link page-col_link--imageless" data-index="'+index+'" data-slug="'+value.slug+'"><h3><span>'+value.title+'</span></h3></div>');
						}
				    },
				    success: function()
				    {
				        if (index%2 == 0 && (index!==28 && index!==30)) {
							$(selector).find(".sliding-pages_container .page-col--one").append('<div class="page-col_link inner-link" data-index="'+index+'" data-slug="'+value.slug+'"><img src="images/exhibitImages/'+value.slug+'.jpg"><h3><span>'+value.title+'</span></h3></div>');
						}
						else if (index==28 && index==30) {
							$(selector).find(".sliding-pages_container .page-col--two").append('<div class="page-col_link inner-link" data-index="'+index+'" data-slug="'+value.slug+'"><img src="images/exhibitImages/'+value.slug+'.jpg"><h3><span>'+value.title+'</span></h3></div>');
						}
						else {
							$(selector).find(".sliding-pages_container .page-col--two").append('<div class="page-col_link inner-link" data-index="'+index+'" data-slug="'+value.slug+'"><img src="images/exhibitImages/'+value.slug+'.jpg"><h3><span>'+value.title+'</span></h3></div>');
						}
				    }
				});
			});
		} else {
			$.each(JSONObject, function(slug, value){
				$(selector).find(".sliding-pages_container").append('<div class="dropdown"><div class="dropdown_link inner-link" data-slug="'+slug+'"><h2 class="dropdown_main-heading">'+value.title+'</h2><h3 class="dropdown_sub-heading">'+value.subHeadingOne+'</h3><h3 class="dropdown_sub-heading">'+value.subHeadingTwo+'</h3></div></div>');
			});
		}
	}

	function scrollToElement(currentPage) {
		var selector = '#'+currentPage
		var offsetTop = $(selector).offset().top;
		console.log(offsetTop);
		$(document).scrollTop(offsetTop);
	}

	$(document).on('click', '.dropdown_main-heading', function(){
		var link = $(this).closest('.sliding-pages_page').find('.sliding-pages_link');
		link.click();
	});

	$(document).on('click', '.inner-link', function(){
		var slug = $(this).data('slug');
		var index = $(this).data('index');

		const params = new URLSearchParams(location.search);
		params.set('page', slug);
		window.history.pushState({}, '', `${location.pathname}?${params}`);

		$.getJSON('data.json',{
          format: 'json'
        }).success(function(data){
        	console.log(currentPage);
        	var JSONObjectUpper = getProperty(currentPage, data)
        	var JSONObject;
        	currentPage == 'exhibits' ? JSONObject = JSONObjectUpper[index] : JSONObject = JSONObjectUpper[slug];
			if (JSONObject) {
				currentPage == 'exhibits' ? loadJSONLower(index, JSONObject) : loadJSONLower(slug, JSONObject);
			}
        });
	});

	function loadJSONLower(slug, JSONObject) {
		var selectorUpper = '#'+currentPage
		$(selectorUpper).find(".sliding-pages_container").remove();
		$(selectorUpper).append('<div class="sliding-pages_container no-padding active"></div>')
		var title = JSONObject.title;
		var slug = JSONObject.slug;
		var subHeadingOne = JSONObject.subHeadingOne;
		var subHeadingTwo = JSONObject.subHeadingTwo;
		var paragraphs = JSONObject.paragraphs;
		var bio = JSONObject.bio;
		var links = JSONObject.links;

		var none = "none";

		$(selectorUpper).find(".sliding-pages_container").append('<div class="dropdown active"><h2 class="dropdown_main-heading">'+title+'</h2><h3 class="dropdown_sub-heading">'+subHeadingOne+'</h3><h3 class="dropdown_sub-heading">'+subHeadingTwo+'</h3></div></div>');

		if (currentPage == "exhibits") {
			$("<img class='dropdown_image' src='images/exhibitImagesInner/"+slug+".jpg' onerror='this.style.display="+none+"' />").appendTo(selectorUpper+" .sliding-pages_container .dropdown");
		}

		$.each(paragraphs, function(paragraph, value){
			$("<p class='dropdown_paragraph'>"+value+"</p>").appendTo(selectorUpper+" .sliding-pages_container .dropdown");
		});

		if(bio) {
			$("<h3 class='dropdown_bio-heading'>BIO</h3>").appendTo(selectorUpper+" .sliding-pages_container .dropdown");
			$.each(bio, function(bio, value){
				$("<p class='dropdown_paragraph'>"+value+"</p>").appendTo(selectorUpper+" .sliding-pages_container .dropdown");
			});
		}

		if(links){
			$("<ul class='dropdown_list'></ul>").appendTo(selectorUpper+" .sliding-pages_container .dropdown");
			$.each(links, function(link, value) {
				if(link.includes("twitter")){
					$("<li><a href=https://twitter.com/"+value+">@"+value+"</a></li>").appendTo(".dropdown_list");
				}
				else{
					$("<li><a href=http://"+value+">"+value+"</a></li>").appendTo(".dropdown_list");
				}
			});
		}
	}
});
