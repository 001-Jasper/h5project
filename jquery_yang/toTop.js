jQuery(document).ready(function($) {	
			if($("meta[name=toTop]").attr("content")=="true"){
				$("<div id='toTop'><img src='./img/totop.png'></div>").appendTo('body');
				$("#toTop").css({
					width: '38px',
					height: '38px',
					bottom:'82px',
					right:'40px',
					position:'fixed',
					cursor:'pointer',
					zIndex:'999999',
				});
				if($(this).scrollTop()==0){
						$("#toTop").hide();
					}
				$(window).scroll(function(event) {
					/* Act on the event */
					if($(this).scrollTop()==0){
						$("#toTop").hide();
					}
					if($(this).scrollTop()!=0){
						$("#toTop").show();
					}
				});	
					$("#toTop").click(function(event) {
								/* Act on the event */
								$("html,body").animate({
									scrollTop:"0px"},
									666
									)
							});
				}
		});