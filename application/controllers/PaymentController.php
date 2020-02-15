<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class PaymentController extends CI_Controller {

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
    
    public function getPaymentTypes() {
        $arrPaymentTypes = $this->payment_model->selectPaymentTypes();
        echo json_encode($arrPaymentTypes);
    }

    public function getChequeList() {
        $postData = json_decode(file_get_contents('php://input'), true);
        $arrChequePayment = $this->payment_model->selectChequePayment($postData['branch_id']);
        echo json_encode($this->returnArray(200, "Successful retrieiving cheque list", $arrChequePayment));
    }

    public function getChequeListPerTenant() {
        $postData = json_decode(file_get_contents('php://input'), true);
        $arrChequePayment = $this->payment_model->selectAllChequePaymentPerTenant($postData['tenant_id']);
        echo json_encode($this->returnArray(200, "Successful retrieiving cheque list", $arrChequePayment));
    }

    public function getChequesForApproval() {
        $postData = json_decode(file_get_contents('php://input'), true);
        $arrChequePayment = $this->payment_model->selectAllChequesForApproval($postData['branch_id']);
        echo json_encode($this->returnArray(200, "Successful retrieiving cheque list", $arrChequePayment));
    }
    public function insertCheques() {
        $postData = json_decode(file_get_contents('php://input'), true);
        $errorFlag = false;
        $arrChequePayments = $postData;

        foreach($arrChequePayments as $index => $payment){
            $payment['cheque_date'] = $this->changeTimezone($payment['cheque_date'])->format('Y-m-d');
            $paymentId = $this->payment_model->insertCheques($payment);
            if($paymentId == 0) {
                $errorFlag = true;
                break;
            }
        }
        
        if($errorFlag == true){
            echo json_encode($this->returnArray(500, "Error inserting new payment"));
        }
        else {
            echo json_encode($this->returnArray(200, "Successful inserting cheque payment"));
        }
    }

    public function deleteChequePayment() {
        $postData = json_decode(file_get_contents('php://input'), true);
        $payment = $postData;
        $paymentStatus = $this->payment_model->deletePaymentItem($payment['tenant_cheque_id'], $payment['branch_id'], "deleted");

        if($paymentStatus > 0) {
            echo json_encode($this->returnArray(200, "Successfully deleted tenant cheque item", $payment));
            
        }
        else {
            echo json_encode($this->returnArray(500, "Error deleting tenant cheque item "));
        }
    }

    public function updateChequeStatus() {
        $postData = json_decode(file_get_contents('php://input'), true);
        $postData['cheque_date'] = $this->changeTimezone($postData['cheque_date'])->format('Y-m-d');
        $paymentStatus = $this->payment_model->updateChequeStatus($postData);

        if($paymentStatus > 0) {
            echo json_encode($this->returnArray(200, "Successfully updated tenant cheque item", $postData));
            
        }
        else {
            echo json_encode($this->returnArray(500, "Error updating tenant cheque item "));
        }
    }

}
