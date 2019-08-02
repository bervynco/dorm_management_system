<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class TenantController extends CI_Controller {

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
    
    public function getTenantDetails() {
        $postData = json_decode(file_get_contents('php://input'), true);
        $arrTenants = $this->tenant_model->selectTenantPerId($postData['tenant_id']);
        echo json_encode($this->returnArray(200, "Successful retrieiving tenant list", $arrTenants));
    }
    public function getAllTenantsPerBranch(){
        $postData = json_decode(file_get_contents('php://input'), true);
        $arrTenants = $this->tenant_model->selectAllTenantsPerBranch($postData['branch_id']);
        echo json_encode($this->returnArray(200, "Successful retrieiving tenant list", $arrTenants));
    }

    public function getChequeDetails(){
        $postData = json_decode(file_get_contents('php://input'), true);
        $arrPaymentDetails = $this->tenant_model->selectAllChequePerTenant($postData['tenant_id']);
        echo json_encode($this->returnArray(200, "Successful retrieiving cheque details list", $arrPaymentDetails));
    }

    public function addNewTenant(){
        // $arrColumns = array('name', 'username', 'role', 'password');
        $postData = json_decode(file_get_contents('php://input'), true);
        $payment = $postData['payment'];
        $paymentId = $payment['payment_id'];
        $paymentName = $payment['payment_type'];
        unset($payment['payment_id']);
        unset($payment['payment_type']);
        unset($postData['payment']);
        $tenantId = $this->tenant_model->insertTenant($postData);
        
        
        if($tenantId != 0){
            if($paymentName == 'Cheque'){
                $payment['tenant_id'] = $tenantId;
                $payment['branch_id'] = $postData['branch_id'];
                $payment['cheque_amount'] = $payment['amount'];
                unset($payment['amount']);
                $chequeId = $this->payment_model->insertCheques($payment);
            }

            if($payment['status'] == 'active'){
                $depositArray = array();
                $depositArray['payment_id'] = $paymentId;
                ($paymentName == 'Cheque') ? $depositArray['tenant_cheque_id'] = $chequeId : $depositArray['tenant_cheque_id'] = 0;
                ($paymentName == 'Cheque') ? $depositArray['amount'] = $payment['cheque_amount'] : $depositArray['amount'] = $payment['amount'];
                $depositArray['tenant_id'] = $tenantId;
                $status = $this->tenant_model->insertDeposit($depositArray);

                if($status > 0){
                    echo json_encode($this->returnArray(200, "Successfully added tenant", $postData));
                }
                else {
                    echo json_encode($this->returnArray(500, "Error inserting new tenant"));
                }
            }
            //for approval
            else {

            }
        }
        else {
            echo json_encode($this->returnArray(500, "Error inserting new tenant"));
        }
        
    }

    public function editTenant(){
        $postData = json_decode(file_get_contents('php://input'), true);
        $status = $this->tenant_model->editTenant($postData);
        // $existing = $this->user_model->checkExisting("update", $arrUserDetail);
        if($status != 0){
            echo json_encode($this->returnArray(200, "Successfully edited tenant", $postData));
        }
        else
            echo json_encode($this->returnArray(500, "Error editing tenant"));
        
    }

    public function deleteTenant() {
        $postData = json_decode(file_get_contents('php://input'), true);
        $tenant = $postData;
        $inventoryStatus = $this->tenant_model->deleteTenant($tenant['tenant_id'], $tenant['branch_id']);

        if($inventoryStatus > 0) {
            echo json_encode($this->returnArray(200, "Successfully deleted tenant", $tenant));
            
        }
        else {
            echo json_encode($this->returnArray(500, "Error deleting tenant"));
        }
    }

    public function addNewPayment(){
        $paymentColumns = array('tenant_id', 'mode');
        $paymentDetailFlag = false;
        $paymentFlag = true;
        $paymentDetailsChequeColumns = array('cheque_number', 'cheque_bank', 'cheque_date', 'amount');
        $paymentDetailsCashColumns = array('amount');
        $postData = json_decode(file_get_contents('php://input'), true);
        $arrPayment = $this->assignDataToArray($postData, $paymentColumns);
        $tenantPaymentId = $this->tenant_model->insertPayment($arrPayment);

        if($tenantPaymentId > 0){
            foreach($postData['paymentDetails'] as $index => $row){
                if($arrPayment['mode'] === "Cheque"){
                    if(!empty($postData['paymentDetails'][$index]['cheque_number'])){
                        $postData['paymentDetails'][$index]['tenant_payment_id'] = $tenantPaymentId;
                        $paymentDetail = $this->tenant_model->insertPaymentDetails($postData['paymentDetails'][$index]);
                        if($paymentDetail <= 0){
                            $paymentDetailFlag = true;
                        }
                    }
                    else {
                        unset($postData['paymentDetails'][$index][$index]);
                    }
                }
            }
            if($paymentDetailFlag == true){
                echo json_encode($this->returnArray(500, "Error inserting new payment"));
            }
            else {
                echo json_encode($this->returnArray(200, "Successfully added new payment", $postData['paymentDetails']));
            }
        }
        else {
            echo json_encode($this->returnArray(500, "Error inserting new payment"));
        }
    }

    public function assignTenantToRoom(){
        $postData = json_decode(file_get_contents('php://input'), true);

        $roomTenant = $this->tenant_model->checkIfAssigned($postData['tenant_id']);
        if(count($roomTenant) > 0){
            $status = $this->tenant_model->deleteRoomTenant($roomTenant[0]['room_tenant_id'], "reassigned");
        }
        
        $roomTenantID = $this->tenant_model->inserRoomTenant($postData['tenant_id'], $postData['room_id']);
        if($roomTenantID != 0){
            echo json_encode($this->returnArray(200, "Successfully assigned to room"));
        }
        else {
            echo json_encode($this->returnArray(500, "Error assigning to room"));
        }
    }

    public function getPaymentHistory() {
        $postData = json_decode(file_get_contents('php://input'), true);
        $arrCheques = $this->tenant_model->getTenantPaymentHistory($postData['tenant_id']);
        echo json_encode($this->returnArray(200, "Successful retrieiving payment history list", $arrCheques));
    }

    public function makeBillingPayment() {
        $postData = json_decode(file_get_contents('php://input'), true);
        $billing = $postData;
        $branchId = $billing['branch_id'];
        unset($billing['branch_id']);
        $billingPaymentId = $this->tenant_model->insertBillingPayment($billing);

        if($billingPaymentId != 0){
            echo json_encode($this->returnArray(200, "Successfully completed payment"));

            if($billing['status'] == 'encashed'){
                $status = $this->tenant_model->updateBillingData($billing['billing_data_id'], 'encashed');
                $status = $this->payment_model->deletePaymentItem($billing['tenant_cheque_id'], $branchId, 'encashed');
            }
            
        }
        else {
            echo json_encode($this->returnArray(500, "Error in payment"));
        }
    }

}
