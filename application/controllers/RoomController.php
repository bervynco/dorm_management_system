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

    public function getTenantWithNoRoom(){
        
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
