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

    public function generateBilling() {
        $postData = json_decode(file_get_contents('php://input'), true);
        $branchId = $postData['branch_id'];

        $computeData = $this->compute_model->getComputeData($branchId);

        echo json_encode($this->returnArray(200, "Successfully generated billing list", $computeData));
    }

}
