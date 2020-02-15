<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class PayableController extends CI_Controller {

	public function index()
	{
    
    }
    
    public function changeTimezone($dateTime) {
        $manilaTimezone = new DateTimeZone('Asia/Manila');
        $dateTime = new DateTime($dateTime, $manilaTimezone);
        $offset = $manilaTimezone->getOffset($dateTime);
        $interval=DateInterval::createFromDateString((string)$offset . 'seconds');
        $dateTime->add($interval);
        return $dateTime;
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

    public function getAllPayableDues() {
        $postData = json_decode(file_get_contents('php://input'), true);
        // $dateNow = new DateTime();
        $datePreviousWeek = new DateTime();
        $dateNextWeek = new DateTime();
        $datePreviousWeek = $this->changeTimezone($datePreviousWeek->format('Y-m-d'));
        $dateNextWeek = $this->changeTimezone($dateNextWeek->format('Y-m-d'));
        $datePreviousWeek = $datePreviousWeek->sub(new DateInterval('P7D'))->format('Y-m-d');
        $dateNextWeek = $dateNextWeek->add(new DateInterval('P7D'))->format('Y-m-d');

        $arrPayables = $this->payable_model->selectAllPayablePerBranchWithDues($postData['branch_id'], $datePreviousWeek, $dateNextWeek);
        echo json_encode($this->returnArray(200, "Successful retrieiving payable list", $arrPayables));
    }
    public function addNewPayable(){
        $postData = json_decode(file_get_contents('php://input'), true);
        $payables = $postData;
        $payables['payable_date'] = $this->changeTimezone($payables['payable_date'])->format('Y-m-d');
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
        $payables['payable_date'] = $this->changeTimezone($payables['payable_date'])->format('Y-m-d');
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
        $payables = $postData['data'];
        $payableStatus = $this->payable_model->deletePayableItem($payables['payable_id'], $payables['branch_id'], $postData['status']);

        if($payableStatus > 0) {
            echo json_encode($this->returnArray(200, "Successfully deleted payable item", $payables));
            
        }
        else {
            echo json_encode($this->returnArray(500, "Error deleting payable item "));
        }
    }

}
