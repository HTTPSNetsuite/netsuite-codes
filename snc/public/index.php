<?php
require '../vendor/autoload.php';
require_once '../db_config/generated-conf/config.php';

$config = include('../config.php');


use Illuminate\Filesystem\Filesystem;
use GuzzleHttp\Client;


$app = new \Slim\Slim();

$app->get('/getFiles', function () use ($app) {
	logMessage("Accepted Request: getFiles " . date('m/d/Y h:i:s') . ".\n"); //log something
	return (validateToken($app->request->headers['TOKEN'], $app) === true) ? getFiles():validateToken($app->request->headers['TOKEN'], $app);
});


$app->post('/getSyncFiles', function () use ($app) {
	$data = file_get_contents("php://input");
	$data = (array)json_decode($data);
	logMessage("Accepted Request: getSyncFiles param of DATE: " . $data['date'] . " and STORE of " . $data['store'] . ' on ' . date('m/d/Y h:i:s') . ".\n"); //log something
	return (validateToken($app->request->headers['TOKEN'], $app) === true) ? getSyncFiles($data['date'], $data['store']):validateToken($app->request->headers['TOKEN'], $app);
});

//Accept files to process from Netsuite
$app->post('/setToAccomplish', function () use ($app) {
	logMessage("Accepted Request: setToAccomplish " . date('m/d/Y h:i:s') . ".\n"); //log something
	$data = file_get_contents("php://input");
	//$data = json_encode($data, dio_truncate(fd, offset));
	$data = (array)json_decode($data);
	$client = new Client();
	//print_r($data);
	foreach ($data['po'] as $file) {
		echo $file."<br/>";
		logMessage("Send Request: http://localhost:9000/post.php " . date('m/d/Y h:i:s') . ".\n"); //log something
		$client->post('http://localhost:9000/post.php', [
		    'body' => [
		        json_encode(processFile($file))
		    ]
		]);
	}
	exit;
});

$app->post('/setDone/:id', function($id){
	logMessage("Accepted Request: setDone " . date('m/d/Y h:i:s') . ".\n"); //log something
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
	logMessage("Return list of files: getFiles " . date('m/d/Y h:i:s') . ".\n"); //log something
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

		//checks if the record is already processed before
		$hasRecord = PurchaseOrderQuery::create()->filterByNumber($data['number'])->find();
		if($hasRecord->count() === 0) {
			logMessage("No duplicate data: processFile " . date('m/d/Y h:i:s') . ".\n"); //log something
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
			logMessage("Return data in JSON: processFile " . date('m/d/Y h:i:s') . ".\n"); //log something
			return $formulated_data;
			print_r($formulated_data);
		} else {
			logMessage("This file(".$newFile.") with store(".$dirname.") is already processed before: processFile " . date('m/d/Y h:i:s') . ".\n"); //log something
		}

		print_r($data);
		
	} else {
		logMessage("Return no such file: processFile " . date('m/d/Y h:i:s') . ".\n"); //log something
		return "No such file!";
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
	} elseif($dirname === 'pg' || $dirname === 'ev' || $dirname === 'wm') {
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
	//query the records having thex` passed id
	$obj = PurchaseOrderQuery::create();
	$filename = $obj->findPK($id);
	$num_rows = $obj->filterById($id)
	       		->count();
	if($num_rows === 1) {
		$newFile = $filename->getFilename();
		$dirname = $filename->getStore();
		$fs = new Filesystem();
		$filePath = '../Repo/' . $dirname . '/';
		//set timezone
		date_default_timezone_set('Asia/Manila');
		echo $current_date = date('m/d/Y');
		if($fs->exists( $filePath . $newFile)) {
			PurchaseOrderQuery::create()
			  	->filterByFilename($newFile)
			  	->filterByStore($dirname)
			  	->update(array('DateCreated' => $current_date, 'IsSync' => '1'));
			$fs->move($filePath . $newFile, '../Repo/' . 'done/' . $dirname . '/'.$newFile);
			logMessage("Database updated: SET DONE COMPLETE " . date('m/d/Y h:i:s') . ".\n"); //log something
		}
	} else {
		logMessage("Unable to update the database" . date('m/d/Y h:i:s') . '\n'); //log something
	}
	
}

function validateToken($token, $app) {
	return ($token === 'nesmar') ? true:$app->response()->status(404);
}


function getSyncFiles($date, $store) {
	$po = PurchaseOrderQuery::create()->filterByDateCreated($date)->filterByStore($store)->find();
	if($po->count() === 1) {
		echo $po->toJSON();	
		logMessage("Return list of sync files: getSyncFiles " . date('m/d/Y h:i:s') . ".\n"); //log something	
	}else {
		echo "Zero result!";
		logMessage("Return zero result: getSyncFiles " . date('m/d/Y h:i:s') . ".\n"); //log something
	}
}


function logMessage($string) {
	$log = file_put_contents('../Repo/log/.log', $string, FILE_APPEND | LOCK_EX) or die("Unable to create/open file. Please check the file permission");
}


//echo "<pre>";
//print_r(getFiles());
//print_r(getSyncFiles());
//setDone(1);
//processFile('wm-waltermart.xml');
//setAccomplish('pg-4800608880006_2015-04-18T00,38,33.5331Z@scn1.scn.ph.ORDERS.xml', true);