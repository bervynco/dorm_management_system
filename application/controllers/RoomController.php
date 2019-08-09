<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class RoomController extends CI_Controller {

	public function index()
	{
    
	}

    public function returnArray($status, $message, $data = null){
        return array('status' => $status, 'message' => $message, 'data' => $data);
    }
    
    public function getAllRoomsPerBranch(){
        $postData = json_decode(file_get_contents('php://input'), true);
        $arrRooms = $this->room_model->selectCountTenantPerRoomPerBranch($postData['branch_id']);
        echo json_encode($this->returnArray(200, "Successful retrieiving room list", $arrRooms));
    }
    public function addRoom(){
        // $arrColumns = array('name', 'username', 'role', 'password');
        $postData = json_decode(file_get_contents('php://input'), true);
        $roomId = $this->room_model->insertRoom($postData);
        
        if($roomId != 0){
            $postData['room_id'] = $roomId;
            echo json_encode($this->returnArray(200, "Successfully added room", $postData));
        }
        else {
            echo json_encode($this->returnArray(500, "Error inserting new room"));
        }
    }

    public function getTenantPerRoom(){
        $postData = json_decode(file_get_contents('php://input'), true);

        $arrData = $this->room_model->selectTenantPerRoom($postData['branch_id'], $postData['room_id']);
        echo json_encode($this->returnArray(200, "Successful retrieiving tenant list", $arrData));
    }

    public function getTenantPerRoomPerBranchSummary(){
        $postData = json_decode(file_get_contents('php://input'), true);

        $arrData = $this->room_model->selectCountTenantPerRoomPerBranch($postData['branch_id']);

        echo json_encode($this->returnArray(200, "Successful retrieiving tenant list", $arrData));
    }

    public function getTenantChequesPerRoom() {
        $postData = json_decode(file_get_contents('php://input'), true);
        $arrData = $this->room_model->selectTenantChequesPerRoom($postData['room_id']);
        $arrPaymentTypes = $this->payment_model->selectPaymentTypes();
        $arrTenantCheques = array();
        foreach($arrData as $index => $data){
            if(!array_key_exists($data['Name'], $arrTenantCheques)){
                 $arrTenantCheques[$data['Name']] = array();
                 $arrTenantCheques[$data['Name']]['cheques'] = array();
                 $arrTenantCheques[$data['Name']]['payment'] = $arrPaymentTypes;
                 $arrTenantCheques[$data['Name']]['room_tenant_id'] = $data['Room Tenant Id'];
                 $arrTenantCheques[$data['Name']]['room_id'] = $data['Room Id'];
                 $arrTenantCheques[$data['Name']]['tenant_id'] = $data['tenant_id'];
                 $arrTenantCheques[$data['Name']]['branch_id'] = $data['branch_id'];
            }
            if($data['tenant_cheque_id'] != ""){
                $chequeDetails = array();
                $chequeDetails['tenant_cheque_id'] = $data['tenant_cheque_id'];
                $chequeDetails['cheque_number'] = $data['cheque_number'];
                $chequeDetails['cheque_bank'] = $data['cheque_bank'];
                $chequeDetails['cheque_amount'] = $data['cheque_amount'];
                $chequeDetails['cheque_date'] = $data['cheque_date'];
                
                array_push($arrTenantCheques[$data['Name']]['cheques'], $chequeDetails);
            }
        }

        // adding initialization
        foreach($arrTenantCheques as $index => $tenantCheques){
            $arrTenantCheques[$index]['selected_payment'] = null;
            $arrTenantCheques[$index]['selected_cheque'] = null;
            if(empty($arrTenantCheques[$index]['cheques'])){
                // default to cash
                $arrTenantCheques[$index]['selected_payment'] = $arrPaymentTypes[1];
                
            }
            else{
                // default to cheque
                $arrTenantCheques[$index]['selected_payment'] = $arrPaymentTypes[0];
                $arrTenantCheques[$index]['selected_cheque'] = $arrTenantCheques[$index]['cheques'][0];
            }
        }
        echo json_encode($this->returnArray(200, "Successfully pulled data", $arrTenantCheques));
    }

    public function getRentPaymentForApproval() {
        $postData = json_decode(file_get_contents('php://input'), true);

        $arrData = $this->room_model->getRentPaymentForApproval($postData['branch_id']);

        echo json_encode($this->returnArray(200, "Successful retrieiving tenant list", $arrData));
    }
    public function addNewRoomTenant() {
        $postData = json_decode(file_get_contents('php://input'), true);
        $tenantId = $postData['tenant_id'];

        unset($postData['tenant_id']);
        $roomTenantId = $this->room_model->insertNewRoomTenant($postData);

        if($roomTenantId > 0) {
            $updateTenant = $this->room_model->updateRoomTenant($tenantId, $postData['room_tenant_id']);

            if($updateTenant == 1){
                $user = $this->tenant_model->selectUser($tenantId);
                echo json_encode($this->returnArray(200, "Successfully added new tenant in a room", $user));
            }
            else {
                echo json_encode($this->returnArray(500, "Error updating user"));
            }
            
        }
        else {
            echo json_encode($this->returnArray(500, "Error inserting new tenant in a room"));
        }
    }

    public function payRentPerTenant() {
        $postData = json_decode(file_get_contents('php://input'), true);

        $status = $postData['status'];
        $month = $postData['month'];
        $year = $postData['year'];
        foreach($postData['data'] as $index => $row){
            $object = array();
            $object['status'] = $status;
            $object['amount'] = $row['payment_amount'];
            $object['payment_id'] = $row['selected_payment']['payment_id'];
            $object['room_tenant_id'] = $row['room_tenant_id'];
            $object['month'] = $month;
            $object['year'] = $year;
            $object['room_tenant_id'] = $row['room_tenant_id'];
            if($row['selected_payment']['payment_name'] === 'Cash'){
                $object['tenant_cheque_id'] = 0;
            }
            else {
                $object['tenant_cheque_id'] = $row['selected_cheque']['tenant_cheque_id'];
                if($status == 'encashed'){
                    $updateArray = array();
                    $updateArray['tenant_cheque_id'] = $row['selected_cheque']['tenant_cheque_id'];
                    $updateArray['status'] = $status;
                    $this->payment_model->updateChequeStatus($updateArray);
                }
            }
            $postStatus = $this->room_model->insertPaymentPerTenant($object);
        }

        echo json_encode($this->returnArray(200, "Successfully added payment"));
    }

    public function payRentPerRoom() {
        $postData = json_decode(file_get_contents('php://input'), true);

        $status = $postData['status'];
        $month = $postData['month'];
        $year = $postData['year'];

        $arrData = $this->room_model->selectTenantPerRoom($postData['data']['branch_id'], $postData['data']['room_id']);

        foreach($arrData as $index => $row){
            $object = array();
            $object['month'] = $month;
            $object['year'] = $year;
            $object['status'] = $status;
            $object['amount'] = $postData['data']['payment_amount'] / count($arrData);
            $object['payment_id'] = $postData['data']['selected_payment']['payment_id'];
            $object['room_tenant_id'] = $row['room_tenant_id'];
            if($postData['data']['selected_payment']['payment_name'] == "Cash"){
                $object['tenant_cheque_id'] = 0;
            }
            else{
                $object['tenant_cheque_id'] = $postData['data']['selected_cheque']['tenant_cheque_id'];
                if($status == 'encashed'){
                    $data = array();
                    $data['tenant_cheque_id'] = $object['tenant_cheque_id'];
                    $data['status'] = $status;
                    $this->payment_model->updateChequeStatus($data);
                }
            }

            $postStatus = $this->room_model->insertPaymentPerTenant($object);
        }
        echo json_encode($this->returnArray(200, "Successfully added payment"));

    }

    public function updateRoomPayment(){
        $postData = json_decode(file_get_contents('php://input'), true);
        $updateChequeStatus = null;
        $updateStatus = null;
        if(!is_null($postData['tenant_cheque_id'])){
            $updateChequeStatus = $this->payment_model->updateChequeStatus($data);
        }
        else{
            $updateStatus = $this->room_model->updateRoomPaymentStatus($postData['room_tenant_payment_id'], $postData['status']);

            if($updateStatus > 0) {
                echo json_encode($this->returnArray(200, "Update Successful"));
                
            }
            else {
                echo json_encode($this->returnArray(500, "Error updating"));
            }
        }
        
    }
    // public function editTenant(){
    //     $arrColumns = array('id', 'name', 'username', 'role');
    //     $postData = json_decode(file_get_contents('php://input'), true);
    //     $arrUserDetail = $this->assignDataToArray($postData, $arrColumns);

    //     $existing = $this->user_model->checkExisting("update", $arrUserDetail);
    //     if($existing == 0){
    //         $user = $this->user_model->updateUser($arrUserDetail);
    //         echo "Successful";
    //     }
    //     else
    //         echo "Existing user with that username";
        
    // }

    // public function deleteTenant(){
    //     $arrColumns = array('id', 'name', 'username', 'role');
    //     $postData = json_decode(file_get_contents('php://input'), true);
    //     $arrUserDetail = $this->assignDataToArray($postData, $arrColumns);
    //     $user = $this->user_model->deleteUser($arrUserDetail);

    //     echo "Successful";
    // }

    

}
