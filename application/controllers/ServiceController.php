<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class ServiceController extends CI_Controller {

	public function index()
	{
    
	}

    public function returnArray($status, $message, $data = null){
        return array('status' => $status, 'message' => $message, 'data' => $data);
    }
    
    public function getAllServices(){
        $postData = json_decode(file_get_contents('php://input'), true);
        $arrTenants = $this->room_model->selectCountTenantPerRoomPerBranch($postData['branch_id']);
        echo json_encode($this->returnArray(200, "Successful retrieiving tenant list", $arrTenants));
    }

    public function addService() {
        $postData = json_decode(file_get_contents('php://input'), true);
        $serviceId = $this->service_model->insertNewService($postData);

        if($serviceId != 0){
            $postData['service_id'] = $serviceId;
            echo json_encode($this->returnArray(200, "Successfully added new service", $postData));
        }
        else {
            echo json_encode($this->returnArray(500, "Error inserting new service"));
        }
    }
    // public function addRoom(){
    //     // $arrColumns = array('name', 'username', 'role', 'password');
    //     $postData = json_decode(file_get_contents('php://input'), true);
    //     $roomId = $this->room_model->insertRoom($postData);
        
    //     if($roomId != 0){
    //         $postData['room_id'] = $roomId;
    //         echo json_encode($this->returnArray(200, "Successfully added room", $postData));
    //     }
    //     else {
    //         echo json_encode($this->returnArray(500, "Error inserting new room"));
    //     }
    // }

    // public function getTenantPerRoom(){
    //     $postData = json_decode(file_get_contents('php://input'), true);

    //     $this->room_model->selectTenantPerRoom();
        
    // }

    // public function getTenantPerRoomPerBranchSummary(){
    //     $postData = json_decode(file_get_contents('php://input'), true);

    //     $arrData = $this->room_model->selectCountTenantPerRoomPerBranch($postData['branch_id']);

    //     echo json_encode($this->returnArray(200, "Successful retrieiving tenant list", $arrData));
    // }

    // public function getTenantWithNoRoom(){
        
    // }
    // public function addNewRoomTenant() {
    //     $postData = json_decode(file_get_contents('php://input'), true);
    //     $tenantId = $postData['tenant_id'];

    //     unset($postData['tenant_id']);
    //     $roomTenantId = $this->room_model->insertNewRoomTenant($postData);

    //     if($roomTenantId > 0) {
    //         $updateTenant = $this->room_model->updateRoomTenant($tenantId, $postData['room_tenant_id']);

    //         if($updateTenant == 1){
    //             $user = $this->tenant_model->selectUser($tenantId);
    //             echo json_encode($this->returnArray(200, "Successfully added new tenant in a room", $user));
    //         }
    //         else {
    //             echo json_encode($this->returnArray(500, "Error updating user"));
    //         }
            
    //     }
    //     else {
    //         echo json_encode($this->returnArray(500, "Error inserting new tenant in a room"));
    //     }
    // }

}
