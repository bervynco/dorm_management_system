<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class UtilityController extends CI_Controller {

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
    
    public function getAllUtility(){
        $postData = json_decode(file_get_contents('php://input'), true);
        $arrUtility = $this->utility_model->selectAllUtility($postData['branch_id']);
        foreach($arrUtility as $index => $utility){
            $readings = $this->utility_model->selectPreviousAndCurrentReading($arrUtility[$index]['utility_id'], $arrUtility[$index]['branch_id']);
            $prices = $this->utility_model->selectPreviousAndCurrentPrice($arrUtility[$index]['utility_id'], $arrUtility[$index]['branch_id']);
            $arrUtility[$index]['current_reading'] = $readings[0]['current_reading'];
            $arrUtility[$index]['current_price'] = $prices[0]['price'];
            if(sizeof($readings) > 1)
                $arrUtility[$index]['previous_reading'] = $readings[1]['current_reading'];
            else
                $arrUtility[$index]['previous_reading'] = 0;
            if(sizeof($prices) > 1)
                $arrUtility[$index]['previous_price'] = $prices[1]['price'];
            else
                $arrUtility[$index]['previous_price'] = 0;
        }
        echo json_encode($this->returnArray(200, "Successful retrieiving utility list", $arrUtility));
    }

    public function checkDuplicate($arrUtility) {
        return $this->utility_model->checkDuplicateTenantUtility($arrUtility);
    }

    public function assignUtilityToTenant(){
        $postData = json_decode(file_get_contents('php://input'), true);
        $arrUtility['branch_id'] = $postData['branch_id'];
        $arrUtility['tenant_id'] = $postData['tenant']['tenant_id'];
        $arrUtility['utility_id'] = $postData['utility']['utility_id'];

        $status = $this->checkDuplicate($arrUtility);
        if($status > 0){
            echo json_encode($this->returnArray(500, "Duplicate entry", $arrUtility));
        }
        else {
            $utilityTenantId = $this->utility_model->insertUtilityTenant($arrUtility);
            if($utilityTenantId > 0)
                echo json_encode($this->returnArray(200, "Successful inserting utility list", $postData));
            else
                echo json_encode($this->returnArray(500, "Error inserting utility list"));

        }
    }

    public function assignServiceToTenant(){
        $postData = json_decode(file_get_contents('php://input'), true);
        // $arrUtility['branch_id'] = $postData['branch_id'];
        // $arrUtility['tenant_id'] = $postData['tenant']['tenant_id'];
        // $arrUtility['utility_id'] = $postData['utility']['utility_id'];

        // $status = $this->checkDuplicate($arrUtility);
        // if($status > 0){
        //     echo json_encode($this->returnArray(500, "Duplicate entry", $arrUtility));
        // }
        // else {
        //     $utilityTenantId = $this->utility_model->insertUtilityTenant($arrUtility);
        //     if($utilityTenantId > 0)
        //         echo json_encode($this->returnArray(200, "Successful inserting utility list", $postData));
        //     else
        //         echo json_encode($this->returnArray(500, "Error inserting utility list"));

        // }
    }

    public function addNewUtility(){
        $arrUtilityBranch = array();
        $postData = json_decode(file_get_contents('php://input'), true);

        $utilityRows = $this->utility_model->checkDuplicateUtility($postData);
        if($utilityRows == 0){
            $utilityID = $this->utility_model->insertUtility($postData);

            if($utilityID > 0){
                echo json_encode($this->returnArray(200, "Successfully inserted"));
            }
            else {
                echo json_encode($this->returnArray(500, "Error inserting utility item"));
            }
        }
        else {
            echo json_encode($this->returnArray(500, "Duplicate entry in utility list"));
        }
    }

    public function editUtility() {
        $postData = json_decode(file_get_contents('php://input'), true);
        $status = $this->utility_model->updateUtility($postData);

        if($status > 0) {
            echo json_encode($this->returnArray(200, "Successfully edited utility", $postData));
            
        }
        else {
            echo json_encode($this->returnArray(500, "Error updating utility"));
        }
    }

    public function deleteUtility() {
        $postData = json_decode(file_get_contents('php://input'), true);
        $status = $this->utility_model->deleteUtility($postData['utility_id'], $postData['branch_id']);

        if($status > 0) {
            echo json_encode($this->returnArray(200, "Successfully deleting utility", $postData));
            
        }
        else {
            echo json_encode($this->returnArray(500, "Error deleting utility"));
        }
    }

    public function addUtilityPrice() {
        $postData = json_decode(file_get_contents('php://input'), true);
        $activeRow = $this->utility_model->selectCurrentActivePrice($postData['utility_id'], $postData['branch_id']);
        if(count($activeRow) > 0){
            $status = $this->utility_model->updateUtilityStatus('utility_price_id', 'utility_price', $activeRow[0]['utility_price_id'], "inactive");
        }
        unset($postData['branch_id']);

        $utilityPriceId = $this->utility_model->insertUtilityPrice($postData);

        if($utilityPriceId > 0) {
            echo json_encode($this->returnArray(200, "Successfully add utility price", $postData));
            
        }
        else {
            echo json_encode($this->returnArray(500, "Error adding utility price"));
        }
    }

    public function addUtilityReading() {
        $postData = json_decode(file_get_contents('php://input'), true);
        $activeRow = $this->utility_model->selectCurrentActiveReading($postData['utility_id'], $postData['branch_id']);
        if(count($activeRow) > 0){
            $status = $this->utility_model->updateUtilityStatus('utility_reading_id', 'utility_reading', $activeRow[0]['utility_reading_id'], "inactive");
        }

        unset($postData['branch_id']);
        $utilityPriceId = $this->utility_model->insertUtilityReading($postData);

        if($utilityPriceId > 0) {
            echo json_encode($this->returnArray(200, "Successfully add utility reading", $postData));
            
        }
        else {
            echo json_encode($this->returnArray(500, "Error adding utility reading"));
        }
    }

    public function getAllReadingAndPricing() {
        $readingAndPricing = array();
        $object = array(
            'state' => "",
            'value' => "",
            'timestamp' => ""
        );

        $postData = json_decode(file_get_contents('php://input'), true);
        $readings = $this->utility_model->selectAllReadings($postData['utility_id'], $postData['branch_id']);
        $pricings = $this->utility_model->selectAllPricings($postData['utility_id'], $postData['branch_id']);

        foreach($readings as $index => $reading) {
            $object['value'] = $readings[$index]['current_reading'];
            $object['state'] = "Reading";
            $object['timestamp'] = $readings[$index]['timestamp'];
            array_push($readingAndPricing, $object);
        }
        foreach($pricings as $index => $price) {
            $object['value'] = $pricings[$index]['price'];
            $object['state'] = "Pricing";
            $object['timestamp'] = $pricings[$index]['timestamp'];
            array_push($readingAndPricing, $object);
        }

        echo json_encode($this->returnArray(200, "Successful retrieiving utility reading and pricing list", $readingAndPricing));
    }

}
