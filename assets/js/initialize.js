$(".modal").modal();
$("select").material_select();
$(".button-collapse").sideNav();

var date = new Date(),
	year = date.getFullYear(),
	month = date.getMonth() + 1,
	day = date.getDate(),
	time = year + '-' + month + '-' + day;

var modifyingInv = false, modifyingStaff = false;

$('[type="number"]').attr({ "min": "0" });

$(".datepicker").pickadate({
	selectMonths: true,
	selectYears: 15,
	format: 'yyyy-mm-dd'
});
