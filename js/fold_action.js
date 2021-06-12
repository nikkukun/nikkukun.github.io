$(document).ready(function () {
	$(document).on('click', '.fold_hider', function () {
		$('&gt;.fold', this.parentNode).slideToggle();
		$('&gt;:first', this).toggleClass('open');
	});
	// 默认情况下折叠
	$("div.fold").css("display", "none");
});