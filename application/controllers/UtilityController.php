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
        echo json_encode($this->returnArray(200, "Successful retrieiving utility list", $arrUtility));
    }

    public function addNewUtility(){
        $arrUtilityBranch = array();
        $postData = json_decode(file_get_contents('php://input'), true);
        $arrUtilityBranch['branch_id'] = $postData['branch_id'];
        unset($postData['branch_id']);

        $utilityId = $this->utility_model->insertUtility($postData);
        if($utilityId > 0){
            $arrUtilityBranch['utility_id'] = $utilityId;
            $utilityBranchId = $this->utility_model->insertUtilityPerBranch($arrUtilityBranch);

            if($utilityBranchId > 0)
                echo json_encode($this->returnArray(200, "Successful inserting utility list", $postData));
            else
                echo json_encode($this->returnArray(500, "Error inserting utility list"));
        }
        else {
            echo json_encode($this->returnArray(500, "Error inserting utility list"));
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
}
