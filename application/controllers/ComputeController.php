<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class ComputeController extends CI_Controller {

	public function index()
	{
    
	}
    public function filter_status($details)
    {
        return $details['status'] == "active";
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

    public function getBillingDetails() {
        $postData = json_decode(file_get_contents('php://input'), true);
        //$billingDetails = $this->compute_model->getBillingDetails($branchId);
        $billingData = $this->compute_model->selectAllBilling($branchId);
        $arrTenant = $this->tenant_model->selectAllTenantsPerBranch($billingInfo['branch_id']);

        foreach($arrTenants as $index => $tenant){
            foreach($billingData as $billingIndex => $billing){
                // $arrTenants[$index]['']
            }
        }
        foreach($billingDetails as $index => $billing){
            $billingDetails['service'] = $this->service_model->selectServicePerId($billingDetails[$index]['service_id']);
            // $billingD

        }
    }
    public function getBilling() {
        $postData = json_decode(file_get_contents('php://input'), true);
        $branchId = $postData['branch_id'];

        $computeData = $this->compute_model->selectAllBilling($branchId);

        foreach($computeData as $index => $data){
            $billingDetails = $this->compute_model->getBillingDetailsPerBillingSummary($branchId, $computeData[$index]['billing_id']);
            if(count($billingDetails) == 2){
                $computeData[$index]['completion'] = ($billingDetails[1]['status_count'] - $billingDetails[0]['status_count'])/($billingDetails[1]['status_count'] + $billingDetails[0]['status_count']);
            }
            else{
                if($billingDetails[0]['status'] == 'active'){
                    $computeData[$index]['completion'] = 0;
                }
                else{
                    $status = $this->compute_model->updateBillingInfo($billingId);
                }
            }
        }
        echo json_encode($this->returnArray(200, "Successfully generated billing informationlist", $computeData));
        
    }

    public function getBillingData() {

    }
    public function determineIfBillingExist($branchId, $billingMonth, $billingYear) {
        $billing = $this->compute_model->checkDuplicateBilling($billingMonth, $billingYear, $branchId);
        if(count($billing) > 0)
            return 1;
        else
            return 0;
    }

    public function generateBilling() {
        $postData = json_decode(file_get_contents('php://input'), true);
        $branchId = $postData['branch_id'];

        $status = $this->determineIfBillingExist($postData['branch_id'], $postData['month'], $postData['year']);
        $status = 0;
        if($status == 1)
            echo json_encode($this->returnArray(500, "Billing information exists. Delete the old billing information if necessary", $postData));
        else{
            $billingId = $this->compute_model->insertBillingInformation($postData);
            if($billingId > 0){
                $this->generateBillingData($billingId, $postData);
            }
            else {
                 echo json_encode($this->returnArray(500, "Error inserting Billing information", $postData));
            }
        }
    }

    public function generateBillingData($branchId) {
        $arrBillingDetails = array();
        $arrDetails = $this->compute_model->getComputeData($branchId);
        $roomDetails = $this->room_model->selectCountTenantPerRoomPerBranch($branchId);
        foreach($arrDetails as $index => $row){

            //Tenant initialization with tenant details and room details
            if(!array_key_exists($row['tenant_name'], $arrBillingDetails)){
                $arrBillingDetails[$row['tenant_name']] = array();
                $arrBillingDetails[$row['tenant_name']]['Service']= array();
                $arrBillingDetails[$row['tenant_name']]['Inventory'] = array();
                $arrBillingDetails[$row['tenant_name']]['Tenant'] = array();
                $arrBillingDetails[$row['tenant_name']]['total_bill'] = 0;
                $arrBillingDetails[$row['tenant_name']]['tenant_count'] = 0;
                //add tenant
                $arrBillingDetails[$row['tenant_name']]['Tenant']['tenant_id'] = $row['tenant_id'];
                $arrBillingDetails[$row['tenant_name']]['Tenant']['tenant_name'] = $row['tenant_name'];

                // check if there is room assigned. If no room assigned, no utility should be added
                if(!empty($row['Room Id'])){
                    $arrBillingDetails[$row['tenant_name']]['Utility'] = array();
                    $arrBillingDetails[$row['tenant_name']]['Room'] = array();
                    $arrBillingDetails[$row['tenant_name']]['Room']['room_id'] = $row['Room Id'];
                    $arrBillingDetails[$row['tenant_name']]['Room']['room_number'] = $row['Room Number'];
                    $arrBillingDetails[$row['tenant_name']]['Room']['room_rent'] = $row['Room Rent'];
                    $arrBillingDetails[$row['tenant_name']]['total_bill'] = $arrBillingDetails[$row['tenant_name']]['total_bill'] + $row['Room Rent'];
                    
                    $roomKey = array_search($row['Room Id'], array_column($roomDetails, 'room_id'));
                    $arrBillingDetails[$row['tenant_name']]['tenant_count'] = $roomDetails[$roomKey]['tenant_count'];

                }
            }

            //check if assigned to room
            if(array_key_exists('Room', $arrBillingDetails[$row['tenant_name']])){
                //determine total tenant count
                $roomKey = array_search($row['Room Id'], array_column($roomDetails, 'room_id'));
                $tenantCount = $roomDetails[$roomKey]['tenant_count'];

                // add utility details
                if(!array_key_exists($row['utility_name'], $arrBillingDetails[$row['tenant_name']]['Utility']) && !empty($row['utility_name'])){
                    $arrBillingDetails[$row['tenant_name']]['Utility'][$row['utility_name']] = array();
                    $arrBillingDetails[$row['tenant_name']]['Utility'][$row['utility_name']]['utility_id'] = $row['utility_id'];
                    $arrBillingDetails[$row['tenant_name']]['Utility'][$row['utility_name']]['utility_name'] = $row['utility_name'];
                    $arrBillingDetails[$row['tenant_name']]['Utility'][$row['utility_name']]['current_reading'] = $row['current_reading'];
                    $arrBillingDetails[$row['tenant_name']]['Utility'][$row['utility_name']]['price'] = $row['price'];
                    $arrBillingDetails[$row['tenant_name']]['total_bill'] = $arrBillingDetails[$row['tenant_name']]['total_bill'] + (($row['current_reading'] * $row['price'])/ $arrBillingDetails[$row['tenant_name']]['tenant_count']);
                    
                }
            }

            // add inventory details
            if(!array_key_exists($row['Inventory Code'], $arrBillingDetails[$row['tenant_name']]['Inventory']) && !empty($row['Inventory Code'])){
                $arrBillingDetails[$row['tenant_name']]['Inventory'][$row['Inventory Code']] = array();
                $arrBillingDetails[$row['tenant_name']]['Inventory'][$row['Inventory Code']]['inventory_name'] = $row['Inventory Name'];
                $arrBillingDetails[$row['tenant_name']]['Inventory'][$row['Inventory Code']]['inventory_id'] = $row['Inventory ID'];
                $arrBillingDetails[$row['tenant_name']]['Inventory'][$row['Inventory Code']]['inventory_rent_amount'] = $row['Inventory Rent Amount'];
                $arrBillingDetails[$row['tenant_name']]['Inventory'][$row['Inventory Code']]['inventory_code'] = $row['Inventory Code'];
                $arrBillingDetails[$row['tenant_name']]['total_bill'] = $arrBillingDetails[$row['tenant_name']]['total_bill'] + $row['Inventory Rent Amount'];  
            }
        }

        return $arrBillingDetails;
    }
    // public function generateBillingData($billingID, $billingInfo){
    //     $details = array();
    //     // $arrRooms = $this->room_model->selectAllRoomsPerBranch($billingInfo['branch_id']);
    //     $arrTenant = $this->tenant_model->selectAllTenantsPerBranch($billingInfo['branch_id']);
    //     $activeUtilityDetails = $this->utility_model->selectAllUtilityPerTenant($billingInfo['branch_id']);
    //     foreach($arrTenant as $index => $tenant){
    //         //$arrTenant[$index]['utility'] = $activeUtilityDetails;
    //         foreach($activeUtilityDetails as $utilityIndex => $utility){
    //             $details['billing_id'] = $billingID;
    //             $details['tenant_id'] = $arrTenant[$index]['tenant_id'];
    //             $details['utility_id'] = $activeUtilityDetails[$utilityIndex]['utility_id'];
    //             $details['utility_reading_id'] = $activeUtilityDetails[$utilityIndex]['utility_reading_id'];
    //             $details['utility_price_id'] = $activeUtilityDetails[$utilityIndex]['utility_price_id'];
    //             $details['utility_amount'] = 0;
    //             $details['status'] = 'active';

    //             $this->compute_model->inserBillingDetails($details);
    //         }
    //         $activeServiceDetails = $this->service_model->selectServicePerTenant($billingInfo['branch_id'], $arrTenant[$index]['tenant_id']);
    //         foreach($activeServiceDetails as $serviceIndex => $service){
    //             $details['billing_id'] = $billingID;
    //             $details['tenant_id'] = $arrTenant[$index]['tenant_id'];
    //             $details['service_id'] = $activeServiceDetails[$serviceIndex]['service_id'];
    //             $details['service_amount'] = $activeServiceDetails[$serviceIndex]['service_fee'];
    //             $details['status'] = 'active';

    //             $this->compute_model->inserBillingDetails($details);
    //         }
    //         // $arrTenant[$index]['services'] = $this->service_model->selectServicePerTenant($billingInfo['branch_id'], $arrTenant[$index]['tenant_id']);
    //         $activeInventoryDetails= $this->inventory_model->selectAllInventoryPerTenant($billingInfo['branch_id'], $arrTenant[$index]['tenant_id']);
    //         foreach($activeInventoryDetails as $inventoryIndex => $inventory){
    //             $details['billing_id'] = $billingID;
    //             $details['tenant_id'] = $arrTenant[$index]['tenant_id'];
    //             $details['inventory_transaction_id'] = $activeInventoryDetails[$inventoryIndex]['inventory_transaction_id'];
    //             $details['inventory_amount'] = $activeInventoryDetails[$inventoryIndex]['rent_amount'];
    //             $details['status'] = 'active';

    //             $this->compute_model->inserBillingDetails($details);
    //         }
    //     }
    //     return true;
    // }
    public function addNewBilling() {
        $postData = json_decode(file_get_contents('php://input'), true);
        $errorFlag = 0;
        $computedData = array();
        $insertArray = array();

        try{
            $billingId = $this->compute_model->getBillingPerDate($postData['branch_id'], $postData['month'], $postData['year']);
        
            if(count($billingId) > 0){
                echo json_encode($this->returnArray(500, "Data exist. Delete your old data to generate a new one"));
            }
            else {
                $billingId = $this->compute_model->insertBillingInformation($postData);
                if($billingId != 0){
                    $computedData = $this->generateBillingData($postData['branch_id']);
                    foreach($computedData as $index => $row){
                        $insertArray['tenant_id'] = $row['Tenant']['tenant_id'];
                        $insertArray['billing_id'] = $billingId;
                        $insertArray['total_amount'] = $row['total_bill'];
                        $insertArray['billing_json'] = json_encode($row);
                        $status = $this->compute_model->insertBillingData($insertArray);
                        if($status == 0){
                            $errorFlag = 1;
                            break;
                        }
                    }
                    if($errorFlag == 1){
                        echo json_encode($this->returnArray(500, "Error generating data"));
                    }
                    else{
                        echo json_encode($this->returnArray(200, "Successful generating data"));
                    }
                }
            }
        }
        catch(Exception $ex){
            echo json_encode($this->returnArray(500, "Error generating data"));
        }
        
    }

}
