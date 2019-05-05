<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class ComputeController extends CI_Controller {

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

    public function getBilling() {
        $postData = json_decode(file_get_contents('php://input'), true);
        $branchId = $postData['branch_id'];

        $computeData = $this->compute_model->selectAllBilling($branchId);

        echo json_encode($this->returnArray(200, "Successfully generated billing informationlist", $computeData));
        
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
        // $computeData = $this->compute_model->getComputeData($branchId);

        // echo json_encode($this->returnArray(200, "Successfully generated billing list", $computeData));
    }

    // public function generateBillingData($billingID, $billingInfo){
    //     $arrRooms = $this->room_model->selectAllRoomsPerBranch($billingInfo['branch_id']);

    

    //     selectTenantPerRoom
    //     $arrUsers = $this->tenant_model->selectAllTenantsPerBranch($billingInfo['branch_id']);
    //     $arrUtility = $this->utiliy_model->selectAllUtilityPerBranch($billingInfo['branch_id']);
    //     foreach($arrUsers as $index => $user){
    //         $arrUsers[$index]['utility'] = $this->utility_model->selectAllUtilityPerTenant($billingInfo['branch_id'], $arrUsers[$index]['tenant_id']);
    //         $arrUsers[$index]['services'] = $this->service_model->selectServicePerTenant($billingInfo['branch_id'], $arrUsers[$index]['tenant_id']);
        
    //     }
    //     echo json_encode($arrUsers);
    // }
    public function addNewBilling() {
        $postData = json_decode(file_get_contents('php://input'), true);
        try{
            $billingId = $this->compute_model->getBillingPerDate($postData['branch_id'], $postData['month'], $postData['year']);
        
            if(count($billingId) > 0){
                echo json_encode($this->returnArray(500, "Data exist. Delete your old data to generate a new one"));
            }
            else {
                $billingId = $this->compute_model->insertBillingInformation($postData);

                if($billingId != 0){
                    //$generateStatus = $this->generateBillingData($billingId, $postData);

                    if($generateStatus == true){
                        echo json_encode($this->returnArray(200, "Generate Completed"));
                    }
                    else {
                        echo json_encode($this->returnArray(500, "Error generating data"));
                    }
                }
            }
        }
        catch(Exception $ex){
            echo json_encode($this->returnArray(500, "Error generating data"));
        }
        
    }

}
