<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class ApprovalRequestController extends CI_Controller {

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

    public function getAllRequest() {
        $postData = json_decode(file_get_contents('php://input'), true);
        $branchId = $postData['branch_id'];
        
        $arrRequestData = $this->request_model->selectAllRequest($branchId);
        foreach($arrRequestData as $index => $request){
            $arrRequestData[$index]['approval_data'] = json_decode($arrRequestData[$index]['approval_data']);
        }
        echo json_encode($this->returnArray(200, "Successfully pulled all request", $arrRequestData));
    }
    public function addApprovalRequest() {
        $postData = json_decode(file_get_contents('php://input'), true);
        $arrRequest = $postData;
        $arrRequest['approval_data'] = json_encode($arrRequest['approval_data']);
        
        $requestId = $this->request_model->insertNewRequest($arrRequest);
        if($requestId > 0)
            echo json_encode($this->returnArray(200, "Successfully inserted request"));
        else
            echo json_encode($this->returnArray(200, "Error inserting request"));
    }

}
