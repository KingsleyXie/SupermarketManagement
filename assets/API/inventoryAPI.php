<?php
error_reporting(0);
header('Content-type: application/json');

if (isset($_POST['barcode'])) {
	$auth = array('http' =>
		array('header' => "Authorization:APPCODE your_APPCODE_here")
		// Add your APPCODE here, you can get it on
		// https://market.aliyun.com/products/56928004/cmapi011806.html
	);
	$context = stream_context_create($auth);

	$base_url = 'http://jisutxmcx.market.alicloudapi.com/barcode2/query?barcode=';

	$response = file_get_contents($base_url . $_POST['barcode'], false, $context);
	if (!$response) {
		$response = json_encode(array('status' => 404));
	}

	echo $response;
	return;
}

header('Location: http://p1.img.cctvpic.com/20120409/images/1333902721891_1333902721891_r.jpg');
