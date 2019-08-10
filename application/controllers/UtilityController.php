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
            // if(count($readings) == 0){
            //     $arrUtility[$index]['current_reading'] = 0;
            // }
            // else{
            //     $arrUtility[$index]['current_reading'] = $readings[0]['current_reading'];
            // }
            
            // if(count($prices) == 0){
            //     $arrUtility[$index]['current_price'] = 0
            // }
            // else{
            //     $arrUtility[$index]['current_price'] = $prices[0]['price'];
            // }
            
            if(sizeof($readings) >= 1){
                $arrUtility[$index]['current_reading'] = $readings[0]['current_reading'];
                
                if(sizeof($readings == 1)){
                    $arrUtility[$index]['previous_reading'] = 0;
                }
                else{
                    $arrUtility[$index]['previous_reading'] = $readings[1]['current_reading'];
                }
            }
            else{
                $arrUtility[$index]['current_reading'] = 0;
                $arrUtility[$index]['previous_reading'] = 0;
            } 
            if(sizeof($prices) >= 1){
                $arrUtility[$index]['current_price'] = $prices[0]['price'];
                
                if(sizeof($prices == 1)){
                    $arrUtility[$index]['previous_price'] = 0;
                }   
                else{
                    $arrUtility[$index]['previous_price'] = $prices[1]['price'];
                }
            }
            else{
                $arrUtility[$index]['current_price'] = 0;
                $arrUtility[$index]['previous_price'] = 0;
            }
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

    function saveBillingStatementPerRoom() {
        $errorFlag = false;
        $postData = json_decode(file_get_contents('php://input'), true);

        $utilityBilling = $postData;

        foreach($utilityBilling as $index => $billing){
            $utilityBilling = $this->utility_model->checkIfUtilityBillingExist($billing);

            if(count($utilityBilling) > 0){
                print_r($utilityBilling[0]['utility_billing_id']);

                echo '<br>';
                $status = $this->utility_model->updateUtilityStatus('utility_billing_id', 'utility_billing', $utilityBilling[0]['utility_billing_id'], 'deleted');
                print_r($status);
                echo '<br><br>';
            }

            $utilityBillingId = $this->utility_model->insertUtilityBillingStatement($billing);
            if($utilityBillingId <= 0){
                $errorFlag = true;
                break;
            }
        }
        if($errorFlag == false){
            echo json_encode($this->returnArray(200, "Successful inserting new utility billing"));
        }
        else{
            echo json_encode($this->returnArray(500, "Error inserting new utility billing"));
        }
        
    }

    function utilityPaymentPerSelfService() {
        $postData = json_decode(file_get_contents('php://input'), true);

        $arrData = $this->room_model->selectTenantPerRoom($postData['data']['branch_id'], $postData['data']['room_id']);
        
        foreach($arrData as $index => $row){
            $object = array();
            $object['month'] = $postData['month'];
            $object['year'] = $postData['year'];
            $object['status'] = $postData['status'];
            $object['amount'] = $postData['data']['amount'] / count($arrData);
            $object['utility_id'] = $postData['data']['utility_id'];
            $object['payment_id'] = $postData['data']['payment_id'];
            $object['room_tenant_id'] = $row['room_tenant_id'];
            $object['payment_arrangement'] = $postData['data']['payment_arrangement'];
            $object['payment_date'] = $postData['data']['payment_date'];
            $object['tenant_cheque_id'] = 0;


            $postStatus = $this->utility_model->insertUtilityPaymentPerTenant($object);
        }
        echo json_encode($this->returnArray(200, "Successfully added payment"));
    }
    function utilityPaymentWhole() {
        $postData = json_decode(file_get_contents('php://input'), true);

        $arrData = $this->room_model->selectTenantPerRoom($postData['data']['branch_id'], $postData['data']['room_id']);
        
        foreach($arrData as $index => $row){
            $object = array();
            $object['month'] = $postData['month'];
            $object['year'] = $postData['year'];
            $object['status'] = $postData['status'];
            $object['amount'] = $postData['data']['amount'] / count($arrData);
            $object['utility_id'] = $postData['data']['utility_id'];
            $object['payment_id'] = $postData['data']['payment_id'];
            $object['room_tenant_id'] = $row['room_tenant_id'];
            $object['payment_arrangement'] = $postData['data']['payment_arrangement'];
            $object['payment_date'] = $postData['data']['payment_date'];

            if($postData['data']['payment'] == "Cheque"){
                $object['tenant_cheque_id'] = $postData['data']['selected_cheque']['tenant_cheque_id'];

                if($postData['status'] == "paid"){
                    $data = array();
                    $data['tenant_cheque_id'] = $object['tenant_cheque_id'];
                    $data['status'] = $status;
                    $this->payment_model->updateChequeStatus($data);
                }
            }
            else{
                $object['tenant_cheque_id'] = 0;
            }
                


            $postStatus = $this->utility_model->insertUtilityPaymentPerTenant($object);
        }
        echo json_encode($this->returnArray(200, "Successfully added payment"));
    }
}
