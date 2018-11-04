<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class PayableController extends CI_Controller {

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
    
    public function getAllPayable() {
        $postData = json_decode(file_get_contents('php://input'), true);
        $arrPayables = $this->payable_model->selectAllPayablePerBranch($postData['branch_id']);
        echo json_encode($this->returnArray(200, "Successful retrieiving payable list", $arrPayables));
    }

    public function addNewPayable(){
        $postData = json_decode(file_get_contents('php://input'), true);
        $payables = $postData;
        $payableStatus = $this->payable_model->insertPayableItem($payables);

        if($payableStatus > 0) {
            echo json_encode($this->returnArray(200, "Successfully added new payable item", $payables));
            
        }
        else {
            echo json_encode($this->returnArray(500, "Error inserting new payable item"));
        }
    }
    
    public function editPayable() {
        $postData = json_decode(file_get_contents('php://input'), true);
        $payables = $postData;
        $payableStatus = $this->payable_model->updatePayableItem($payables);

        if($payableStatus > 0) {
            echo json_encode($this->returnArray(200, "Successfully edited payable item", $payables));
            
        }
        else {
            echo json_encode($this->returnArray(500, "Error updating payable item "));
        }
    }

    public function deletePayable() {
        $postData = json_decode(file_get_contents('php://input'), true);
        $payables = $postData;
        $payableStatus = $this->payable_model->deletePayableItem($payables['payable_id'], $payables['branch_id']);

        if($payableStatus > 0) {
            echo json_encode($this->returnArray(200, "Successfully deleted payable item", $payables));
            
        }
        else {
            echo json_encode($this->returnArray(500, "Error deleting payable item "));
        }
    }

}
