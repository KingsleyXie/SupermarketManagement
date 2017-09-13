$(".modal").modal();
$("select").material_select();
$(".button-collapse").sideNav();

$("#loading").hide();

var date = new Date(),
	year = date.getFullYear(),
	month = date.getMonth() + 1,
	day = date.getDate(),
	time = year + '-' + month + '-' + day;

var modifyingInv = false, vmodifyingStaff = false;

$(".datepicker").pickadate({
	selectMonths: true,
	selectYears: 15,
	format: 'yyyy-mm-dd'
});
