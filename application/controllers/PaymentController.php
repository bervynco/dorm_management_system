<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class PaymentController extends CI_Controller {

	public function index()
	{
    
	}
    public function assignDataToArray($postData, $arrColumns){
        $insertArray = array();
        foreach($arrColumns as $col){
            $insertArray[$col] = (!empty($postData[$col])) ? $postData[$col] : null;
        }
        return $insertArray;
    }

    public function returnArray($status, $message, $data = null){
        return array('status' => $status, 'message' => $message, 'data' => $data);
    }
    
    public function getPaymentTypes() {
        $arrPaymentTypes = $this->payment_model->selectPaymentTypes();
        echo json_encode($arrPaymentTypes);
    }

    public function getChequePaymentPerTenant() {
        
    }

}
