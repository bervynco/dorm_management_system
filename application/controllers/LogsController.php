<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class LogsController extends CI_Controller {

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
    
    public function getAllLogs() {
        $postData = json_decode(file_get_contents('php://input'), true);
        $arrLogs = $this->log_model->selectAllLogsPerBranch($postData['branch_id']);
        echo json_encode($this->returnArray(200, "Successful retrieiving payable list", $arrLogs));
    }

    public function addPageLog(){
        $postData = json_decode(file_get_contents('php://input'), true);
        $payableStatus = $this->log_model->insertLogItem($postData);

        if($payableStatus > 0) {
            echo json_encode($this->returnArray(200, "Successfully added new log item", $postData));
            
        }
        else {
            echo json_encode($this->returnArray(500, "Error inserting new payable item"));
        }
    }
}
