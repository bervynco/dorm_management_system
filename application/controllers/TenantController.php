<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class TenantController extends CI_Controller {

	public function index()
	{
    
	}

    public function returnArray($status, $message, $data = null){
        return array('status' => $status, 'message' => $message, 'data' => $data);
    }
    public function getAllTenantsPerBranch(){
        $postData = json_decode(file_get_contents('php://input'), true);
        $arrTenants = $this->tenant_model->selectAllTenantsPerBranch(1);
        echo json_encode($this->returnArray(200, "Successful retrieiving tenant list", $arrTenants));
    }
    public function addNewTenant(){
        // $arrColumns = array('name', 'username', 'role', 'password');
        $postData = json_decode(file_get_contents('php://input'), true);
        $tenantId = $this->tenant_model->insertTenant($postData);
        
        if($tenantId != 0){
            $postData['tenant_id'] = $tenantId;
            echo json_encode($this->returnArray(200, "Successfully added tenant", $postData));
        }
        else {
            echo json_encode($this->returnArray(500, "Error inserting new tenant"));
        }
        
    }

    public function editTenant(){
        $arrColumns = array('id', 'name', 'username', 'role');
        $postData = json_decode(file_get_contents('php://input'), true);
        $arrUserDetail = $this->assignDataToArray($postData, $arrColumns);

        $existing = $this->user_model->checkExisting("update", $arrUserDetail);
        if($existing == 0){
            $user = $this->user_model->updateUser($arrUserDetail);
            echo "Successful";
        }
        else
            echo "Existing user with that username";
        
    }

    public function deleteTenant(){
        $arrColumns = array('id', 'name', 'username', 'role');
        $postData = json_decode(file_get_contents('php://input'), true);
        $arrUserDetail = $this->assignDataToArray($postData, $arrColumns);
        $user = $this->user_model->deleteUser($arrUserDetail);

        echo "Successful";
    }

    

}
