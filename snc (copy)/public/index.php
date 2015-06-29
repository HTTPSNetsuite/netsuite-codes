<?php
require '../vendor/autoload.php';
require_once '../db_config/generated-conf/config.php';

$config = include('../config.php');


use Illuminate\Filesystem\Filesystem;
use GuzzleHttp\Client;


$url = 'http://localhost:9000/post.php';
$token = "nesmar";

$app = new \Slim\Slim();
$app->get('/getFiles', function () use ($app) {
	return (validateToken($app->request->headers['TOKEN'], $app, $token) === true) ? getFiles():validateToken($app->request->headers['TOKEN'], $app, $token);
});


//Accept files to process from Netsuite
$app->post('/setToAccomplish', function () use ($app) {
	$data = file_get_contents("php://input");
	//$data = json_encode($data, dio_truncate(fd, offset));
	$data = (array)json_decode($data);
	$client = new Client();
	//print_r($data);
	foreach ($data['po'] as $file) {
		echo $file."<br/>";
		$client->post($url, [
		    'body' => [
		        json_encode(processFile($file))
		    ]
		]);
	}
	exit;
});

$app->post('/setDone:id', function($id){
	setDone($id);
});

$app->run();

function getFiles() {	
	$fs = new Filesystem();
	$dir = $fs->directories('../Repo');
	$array_of_files = [];	
	foreach ($dir as $directories) {
		$files = $fs->files($directories);
		foreach ($files as $file) {
			if($fs->extension($file) === "xml") {
				$file = str_replace('/', '-', str_replace('../Repo/', '', $file));		
				$n_arr = [];
				$n_arr['file'] = $file;
				array_push($array_of_files, $n_arr);
			}
		}
	}
	
	header('Content-type: application/json');
	echo json_encode($array_of_files);
	exit;
}

//get the data on a file
function processFile($filename) {
	//extract the filename to get the exact filename on the folder
	$newFile = substr($filename, 3);
	$dirname = substr($filename, 0, 2);
	$fs = new Filesystem();
	if($fs->exists('../Repo/' . $dirname . '/' . $newFile)) {
		$xml = simplexml_load_file('../Repo/' . $dirname . '/' . $newFile, null, LIBXML_NOCDATA);
		$newXML = json_decode(json_encode($xml), true);
		$data = formulateData($newXML, $dirname);
		
		//insert data to db
		$po = new PurchaseOrder();
		$po->setFilename($newFile);
		$po->setStore($dirname);
		$po->setCustomerCode($data['customer_code']);
		$po->setDeliveryDate($data['delivery_date']);
		$po->setNumber($data['number']);
		$po->save();

		$po_id = $po->getId();
		//insert all items
		foreach ($data['items'] as $key => $value) {
			$items = new Item();
			$items->setPurchaseOrderId($po_id);
			$items->setUpc($value['upc']);
			$items->setQty($value['qty']);
			$items->setQty($value['discount']);
			$items->save();
		}
		
		
		$formulated_data = formulateData($newXML, $dirname);
		$formulated_data['id'] = $po_id;
		//print_r($formulated_data);
		return $formulated_data;

	}
}


function formulateData($newXML, $dirname) {
	$new_array = [];
	if($dirname === 'sm') {
		$new_array['number'] = $newXML['document']['header']['VendorCode'];
		$new_array['customer_code'] = $newXML['document']['header']['SiteCode'];				
		$new_array['delivery_date'] = $newXML['document']['header']['PostDate'];
		$array_of_items = [];		
		foreach ($newXML['document']['body']['article'] as $bodyKey) {
			$array_items = [];
			$array_items['upc'] = $bodyKey['SKUMatCode'];
			$array_items['discount'] = $bodyKey['ArticleDescription']['Discount'];
			$array_items['qty'] = $bodyKey['BuyQty'];
			$array_of_items[] = $array_items;
		}
		$new_array['items'] = $array_of_items;
	} elseif($dirname === 'pg') {
		$new_array['number'] = $newXML['@attributes']['documentId'];
		$new_array['customer_code'] = $newXML['buyer']['gln'];				
		$new_array['delivery_date'] = $newXML['deliveryDate']['from']['date'];
		$array_of_items = [];	
			for ($i=0; $i < count($newXML['lineItems']); $i++) { 
				$array_items = [];
				$array_items['upc'] = $newXML['lineItems'][$i]['itemId']['gtin'];
				$array_items['discount'] = $newXML['lineItems'][$i]['requestedQuantity']['@attributes']['ordered'];
				$array_items['qty'] = 'wala pa';
				$array_of_items[] = $array_items;
			}
		$new_array['items'] = $array_of_items;
	}
	return $new_array;
}

function setDone($id) {
	//query the records having the passed id
	$filename = PurchaseOrderQuery::create()->findPK($id);
	$newFile = $filename->getFilename();
	$dirname = $filename->getStore();
	$fs = new Filesystem();
	$filePath = '../Repo/' . $dirname . '/';
	if($fs->exists( $filePath . $newFile)) {
		PurchaseOrderQuery::create()
		  	->filterByFilename($newFile)
		  	->filterByStore($dirname)
		  	->update(array('IsSync' => '1'));
		$fs->move($filePath . $newFile, '../Repo/' . 'done/' . $dirname . '/'.$newFile);
	}
}

function validateToken($token, $app, $token1) {
	return ($token === $token1) ? true:$app->response()->status(404);
}


function getSyncFiles() {
	
}


/*
echo "<pre>";
setDone(9, true);*/
//echo processFile('pg-4800608880006_2015-04-18T00,38,33.1603Z@scn1.scn.ph.ORDERS.xml');
//setAccomplish('pg-4800608880006_2015-04-18T00,38,33.5331Z@scn1.scn.ph.ORDERS.xml', true);